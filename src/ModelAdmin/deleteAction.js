const promiseAllProps = require('promise-all-props')
const { checkPermission, PERMISSION } = require('../userSession')
const deepAssign = require('deep-assign')

function flat(arr) {
  return arr.reduce((acc, val) => acc.concat(val), [])
}

function calcCascadeClosure(req, entries) {
  const processedEntries = []
  const rdeps = getReverseDependencies(req)
  const Op = req.SA.Sequelize.Op

  function calcCascade(entries, level = 0) {
    return Promise.all(
      entries.map(entry => {
        const topModel = entry.constructor
        if (rdeps[topModel.name] && !processedEntries.includes(entry)) {
          processedEntries.push(entry)
          return Promise.all(
            Object.keys(rdeps[topModel.name]).map(rdepName => {
              const { target, foreignKeys } = rdeps[topModel.name][rdepName]
              const whereClause = {
                where: {
                  [Op.or]: foreignKeys.map(fkName => ({
                    [fkName]: entry[topModel.primaryKeyAttribute]
                  }))
                }
              }
              return target
                .findAll(whereClause)
                .then(entries => calcCascade(entries, level + 1))
                .then(arr => flat(arr))
            })
          ).then(arr => [{ entry, level }].concat(flat(arr)))
        } else return [{ entry, level }]
      })
    ).then(arr => flat(arr))
  }

  return calcCascade(entries).then(entriesArr => {
    return Promise.all(
      entriesArr.map(({ entry, level }) => {
        const model = entry.constructor
        const modelAdmin = req.SA.modelAdminManager.getModelAdminByModelName(
          model.name
        )
        return promiseAllProps({
          denied: !checkPermission(req, PERMISSION.DELETE, model.name),
          repr: modelAdmin.repr(req, entry),
          level
        }).then(reprObj => {
          reprObj.repr = req.SA.trModel(modelAdmin) + ' • ' + reprObj.repr
          return reprObj
        })
      })
    )
  })
}

/**
 *
 * @param {Express.Request} req
 * @private
 * @returns {Object} flat dictionary, where each parent model name links to
 * dictionary of BelongsTo* models with list of referenced foreignKeys, like this:
 * { nameOfparentModel: { nameOfchildModel: { model: childModel, foreignKeys: [field, ...] } } }
 */
function getReverseDependencies(req) {
  return Object.keys(req.SA.sequelizeInstance.models)
    .map(modelName => req.SA.sequelizeInstance.models[modelName])
    .map(model =>
      Object.keys(model.associations)
        .filter(
          associationName =>
            ['HasMany', 'HasOne'].includes(
              model.associations[associationName].associationType
            ) &&
            model.associations[
              associationName
            ].options.onDelete.toUpperCase() === 'CASCADE'
        )
        .reduce((acc, associationName) => {
          const target = model.associations[associationName].target
          deepAssign(acc, {
            [model.name]: {
              [target.name]: {
                target,
                foreignKeys: []
              }
            }
          })
          // acc[model.name] = acc[model.name] || {}
          // acc[target.name][model.name] = acc[target.name][model.name] || {
          //   model,
          //   foreignKeys: []
          // }
          acc[model.name][target.name].foreignKeys.push(
            model.associations[associationName].foreignKey
          )
          return acc
        }, {})
    )
    .reduce((acc, curr) => Object.assign(acc, curr), {})
}

function deleteAction(req, res, modelAdmin, ids) {
  let transaction
  if (req.body.confirm === 'yes') {
    // TODO проверку прав
    return req.SA.sequelizeInstance
      .transaction()
      .then(_transaction => (transaction = _transaction))
      .then(() =>
        modelAdmin.model.destroy(
          {
            where: {
              [modelAdmin.pkName]: ids
            }
          },
          {
            transaction
          }
        )
      )
      .then(() => transaction.commit())
      .catch(() => transaction.rollback())
      .then(() =>
        res.redirect(
          302,
          req.SA.queryExtender(['model', req.SA.modelName], {}, [
            'action',
            'entryIds'
          ])
        )
      )
  } else if (!req.body.confirm) {
    return modelAdmin.model
      .findAll({
        where: {
          [modelAdmin.pkName]: ids
        }
      })
      .then(entries => calcCascadeClosure(req, entries))
      .then(entryReprList =>
        res.pugrender('deleteAction', {
          entryReprList,
          denied: entryReprList.filter(e => e.denied).length
        })
      )
  } else {
    res.redirect(
      302,
      req.SA.queryExtender(['model', req.SA.modelName], {}, [
        'action',
        'entryIds'
      ])
    )
  }
}

module.exports = deleteAction
