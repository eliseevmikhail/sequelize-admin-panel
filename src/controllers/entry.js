const { checkPermission, PERMISSION } = require('../userSession')
const { PermissionError } = require('../errors')

/* 
 * Just show editor screen.
 * If validationError exists, using req.body form data and show errors
 * else using entry data
 */
function displayEntryEditor(req, res, next, entry, validationError) {
  if (!checkPermission(req, PERMISSION.READ, req.SA.modelName))
    next(new PermissionError('No read permission'))

  const modelAdmin = req.SA.modelAdminInstance
  modelAdmin
    .getEditorData(req, entry, validationError)
    .then(data => {
      res.pugrender('entry', {
        data,
        pageTitle: data.header,
        isNewEntry: req.params.id === 'new'
      })
    })
    .catch(next)
}

/*
 * Get handler for entry editor screen, call displayEntryEditor
 */
function get(req, res, next) {
  const modelAdmin = req.SA.modelAdminInstance,
    id = req.params.id

  ;(id === 'new'
    ? Promise.resolve(modelAdmin.model.build())
    : modelAdmin.model.findById(id)
  )
    .then(entry => displayEntryEditor(req, res, next, entry, null))
    .catch(next)
}

/*
 * Post handler for entry editor screen, apply and save operations
 */
function post(req, res, next) {
  const modelAdmin = req.SA.modelAdminInstance,
    id = req.params.id,
    isApply = req.body._sa_action === 'apply'

  if (
    id === 'new' &&
    !checkPermission(req, PERMISSION.CREATE, req.SA.modelName)
  )
    return next(new Error('No create permission'))
  if (
    id !== 'new' &&
    !checkPermission(req, PERMISSION.UPDATE, req.SA.modelName)
  )
    return next(new Error('No update permission'))

  let entry
  ;(id === 'new'
    ? Promise.resolve(modelAdmin.model.build()) // dummy entry
    : modelAdmin.model.findById(id)
  )
    .then(_entry => (entry = _entry))
    .then(() => {
      // just reload
      if (!req.body._sa_action) {
        displayEntryEditor(
          req,
          res,
          next,
          entry,
          new req.SA.Sequelize.ValidationError()
        ) // dummy error
        throw 'goto end'
      }
    })
    .then(() => modelAdmin.save(req, entry))
    .then(
      () =>
        isApply
          ? res.redirect(
              302,
              req.SA.queryExtender([
                'entry',
                req.SA.modelName,
                entry[modelAdmin.pkName]
              ])
            )
          : res.redirect(
              302,
              req.SA.queryExtender(['model', req.SA.modelName])
            ),
      error => {
        if (error instanceof req.SA.Sequelize.ValidationError)
          return displayEntryEditor(req, res, next, entry, error)
        else throw error
      }
    )
    .catch(error => {
      if (error !== 'goto end') throw error
    })
    .catch(next)
}
function entry(req, res, next) {
  if (req.SA.modelAdminInstance.entryRenderer instanceof Function)
    req.SA.modelAdminInstance.entryRenderer(req, res, next)
  else {
    if (req.method === 'GET') get(req, res, next)
    else if (req.method === 'POST') post(req, res, next)
    else next(new Error(400))
  }
}

module.exports = entry
