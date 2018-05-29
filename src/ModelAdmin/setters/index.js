const getAssociations = require('../../utils/getAssociations')

function defaultSetter(req, entry, fieldName, transaction) {
  entry[fieldName] = req.body[fieldName]
}

function toOneSetter(req, entry, fieldName, transaction) {
  const {
    targetSetter,
    targetModelAdmin,
    targetModel
  } = getAssociations(req, entry, fieldName),
  id = req.body[fieldName] || null

  return (id
    ? targetModel.findById(id, {
      attributes: [targetModelAdmin.pkName]
    }, {
      transaction
    })
    .then(targetEntries => {
      return entry[targetSetter](targetEntries, {
        transaction
      })
    })
    : entry[targetSetter]([null], {
      transaction
    }))
}

function toManySetter(req, entry, fieldName, transaction) {
  const
  Op = req.SA.Sequelize.Op,
  {
    targetSetter,
    targetModelAdmin,
    targetModel
  } = getAssociations(req, entry, fieldName),
  value = req.body[fieldName] || [],
  ids = value instanceof Array ? value : [value]

  return targetModel.findAll({
    attributes: [targetModelAdmin.pkName],
    where: {
      [targetModelAdmin.pkName]: {
        [Op.in]: ids
      }
    }
  }, {
    transaction
  })
  .then(targetEntries =>
    entry[targetSetter](targetEntries, {
      transaction
    })
  )
}

module.exports = {
  STRING: defaultSetter,
  TEXT: defaultSetter,
  INTEGER: defaultSetter,
  BIGINT: defaultSetter,
  FLOAT: defaultSetter,
  REAL: defaultSetter,
  DOUBLE: defaultSetter,
  DECIMAL: defaultSetter,
  DATE: defaultSetter,
  DATEONLY: defaultSetter,
  BOOLEAN: (req, entry, fieldName, transaction) => entry[fieldName] = !!req.body[fieldName],
  JSON: defaultSetter,
  JSONB: defaultSetter,
  BLOB: defaultSetter,
  UUID: defaultSetter,
  ARRAY: defaultSetter,
  GEOMETRY: defaultSetter,
  BelongsTo: toOneSetter,
  HasOne: toOneSetter,
  HasMany: toManySetter,
  BelongsToMany: toManySetter,
}
