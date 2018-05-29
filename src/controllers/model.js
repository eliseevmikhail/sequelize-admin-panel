const { checkPermission, PERMISSION } = require('../userSession')
/*
 * get handler for entry list, show table
 */
function get(req, res, next) {
  if (!checkPermission(req, PERMISSION.READ, req.SA.modelName))
    next(new Error('No read permission'))
  const modelAdmin = req.SA.modelAdminInstance
  modelAdmin
    .getDisplayListData(req)
    .then(data => {
      res.pugrender('model', {
        data,
        pageTitle: req.SA.trModel(modelAdmin).plural
      })
    })
    .catch(next)
}

/*
 * post handler for entry list, handle actions
 */
function post(req, res, next) {
  const modelAdmin = req.SA.modelAdminInstance,
    action = req.SA.params.action,
    ids = req.SA.utils.toArray(req.SA.params.entryIds)
  Promise.resolve(
    modelAdmin.doAction(req, res, action, ids.map(id => parseInt(id, 10)))
  ).catch(next)
}

function model(req, res, next) {
  if (req.SA.modelAdminInstance.modelListRenderer instanceof Function)
    req.SA.modelAdminInstance.modelListRenderer(req, res, next)
  else {
    if (req.method === 'GET') get(req, res, next)
    else if (req.method === 'POST') post(req, res, next)
    else next(new Error(400))
  }
}

module.exports = model
