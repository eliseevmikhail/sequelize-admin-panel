/** @module sequelize-admin */
/* eslint no-console: 0 */
const ModelAdmin = require('./ModelAdmin')
const modelList = require('./controllers/models')
const serveStatic = require('serve-static')
const path = require('path')
const { checkSession, login, logout } = require('./userSession')
const cli = require('./cli')

String.prototype.capitalize = function() {
  return this.charAt(0).toLocaleUpperCase() + this.slice(1)
}

/**
 * Creates middleware
 * @method sequelizeAdmin
 * @param {Express} express Express
 * @param {Sequelize.Instance} sequelizeInstance - db connection
 * @param {Object} [{ models, translation }] options
 * @returns {Function} sequelize-admin middleware
 */
function sequelizeAdmin(
  express,
  sequelizeInstance,
  { models, translation = {}, formidableOpts = {} } = {}
) {
  const router = express.Router()
  // static paths
  ;[
    'static',
    '../node_modules/bootstrap/dist',
    '../node_modules/jquery/dist',
    '../node_modules/popper.js/dist',
    '../node_modules/bootstrap4-datetimepicker/build',
    '../node_modules/moment/min',
    '../node_modules/moment-timezone/builds',
    '../node_modules/open-iconic/font'
  ].map(lib => router.use('/static', serveStatic(path.join(__dirname, lib))))

  router.use(require('./middleware/formidable-body-parser')(formidableOpts))

  // auth session
  router.use(require('./middleware/session'))

  // keep useful parameters in request
  router.use(
    require('./middleware/extend-request')(
      sequelizeInstance,
      models,
      translation
    )
  )
  router.use(require('./middleware/through-params'))

  // use own render method for app engine sanity
  router.use(require('./middleware/pugrender'))

  // login
  router.all('/login', login)
  router.get('/logout', logout)
  router.use(checkSession)

  router.all('/entry/:model/:id', require('./controllers/entry'))
  router.all('/model/:model', require('./controllers/model'))
  router.get('/', modelList)

  router.use((req, res, next) => res.pugrender('404'))

  /* eslint no-unused-vars:0 */
  router.use(function(error, req, res, next) {
    console.error(error)
    res.pugrender('error', {
      error
    })
  })
  return router
}

module.exports = {
  /** @prop {Function} sequelizeAdmin middleware builder*/
  sequelizeAdmin,
  /** @prop {ModelAdmin} ModelAdmin - ModelAdmin base class*/
  ModelAdmin,
  /** @prop {Function} cli - cli interface*/
  cli
}
