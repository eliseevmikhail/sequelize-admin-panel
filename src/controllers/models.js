/*
 * get handler for models list
 */
module.exports = function (req, res, next) {
  res.pugrender('models', {
    modelAdmins: req.SA.modelAdminManager.modelAdminList,
    pageTitle: req.SA.tr('site_title')
  })
}
