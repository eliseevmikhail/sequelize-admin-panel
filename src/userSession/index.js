const userModelBuilder = require('./userModelBuilder')
const PERMISSION = require('./permissions')

function loginForm(req, res) {
  res.pugrender('login', {
    pageTitle: req.SA.tr('site_title')
  })
}

function checkSession(req, res, next) {
  const UserModel = req.SA.modelAdminManager.getModelAdminByModelName(
    userModelBuilder.userModelName
  ).model
  // dev mode has EMERGENCY user if there is not valid superuser
  ;(process.env.NODE_ENV !== 'production'
    ? UserModel.find({
        where: {
          enabled: true,
          superuser: true
        }
      })
    : Promise.resolve(true)
  )
    .then(entry => {
      if (!entry) {
        req.session.sa_username = 'EMERGENCY'
        req.session.sa_emergency = true
        req.session.sa_superuser = true
        next()
      } else if (req.session.sa_username) {
        UserModel.find({
          where: {
            username: req.session.sa_username,
            enabled: true
          }
        }).then(entry => {
          if (entry) {
            try {
              req.session.sa_permissions = JSON.parse(entry.permissions)
              req.session.sa_superuser = entry.superuser
              next()
            } catch (e) {
              next(e)
            }
            // } else if (req.session.sa_emergency) {
            //   next()
          } else {
            req.session.destroy()
            res.redirect(302, req.SA.queryExtender(['login'], {backurl:req.originalUrl}, false))
          }
        })
      } else res.redirect(302, req.SA.queryExtender(['login'], {backurl:req.originalUrl}, false))
    })
    .catch(next)
}

function login(req, res, next) {
  // if (req.session.sa_emergency) res.redirect(302, req.SA.queryExtender())
  // requisites exists
  if (req.body.username && req.body.password) {
    checkPassword(req, req.body.username, req.body.password)
      .then(result => {
        if (result) {
          req.session.sa_username = req.body.username
          res.redirect(302, req.SA.params.backurl || req.SA.queryExtender())
        } else {
          loginForm(req, res, next)
        }
      })
      .catch(next)
    // session exist
  } else if (req.session && req.session.sa_username)
    res.redirect(302, req.SA.params.backurl || req.SA.queryExtender())
  else loginForm(req, res, next)
}

function logout(req, res) {
  req.session.destroy()
  res.redirect(302, req.baseUrl)
}

function checkPassword(req, username, password) {
  return req.SA.modelAdminManager
    .getModelAdminByModelName(userModelBuilder.userModelName)
    .model.find({
      where: {
        username: username,
        enabled: true
      }
    })
    .then(entry => {
      return entry ? entry.checkPassword(password) : false
    })
  // return username === "demo" && password === "demo"
}

function checkPermission(req, action, modelName) {
  return !!(
    req.session.sa_superuser ||
    req.session.sa_permissions[modelName] & PERMISSION.ALL ||
    req.session.sa_permissions[modelName] & action
  )
}

module.exports = {
  checkSession,
  login,
  logout,
  checkPermission,
  UserModelAdmin: require('./UserModelAdmin'),
  userModelBuilder,
  PERMISSION
}
