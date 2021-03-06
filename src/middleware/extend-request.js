const url = require('url')
const ModelAdminManager = require('../ModelAdminManager')
const l10n = require('../l10n')
const { checkPermission, PERMISSION } = require('../userSession')

/**
 * @namespace req.SA
 * @description Available as req.SA everywhere
 * @prop {Object} sequelizeInstance Sequelize instance
 * @prop {Sequelize} Sequelize sequelize constructor
 * @prop {Object} modelAdminManager ModelAdminManager instance
 * @prop {String} modelName current model name from url
 * @prop {Object} modelAdminInstance ModelAdmin instance for current model
 * @prop {Object} PERMISSION user session permissions
 * @prop {Object} utils {@link req.SA.utils}
 */

/**
 *  @namespace req.SA.utils
 */

/**
 * Covert any value to one-element array, null to []
 * @method req.SA.utils.toArray
 * @param {*} value
 * @returns {Array}
 */

/**
 * Ellipsize string to some length, add ...
 * @method req.SA.utils.clip
 * @param {String} str
 * @param {Number} len
 * @returns {String}
 */

/**
 * Translates message
 * @method req.SA.tr
 * @param {String} message
 * @param {String} default
 * @returns {String}
 */

/**
 * Translates model name
 * @method req.SA.trModel
 * @param {ModelAdmin} modelAdmin
 * @returns {Object} { label, plural, hint}
 */

/**
 * Translates field name
 * @method req.SA.trField
 * @param {String} modelName
 * @param {String} fieldName
 * @param {String} default
 * @returns {String}
 */

/**
 * Translates action name
 * @method req.SA.trAction
 * @param {String} actionName
 * @param {String} default
 * @returns {String}
 */

/**
 * Get ValidationError
 * @method req.SA.getSequelizeError
 * @param {String} type error type
 * @param {String} fieldName field name on which error occured
 * @throws {Sequelize.ValidationError}
 */

/**
 * Check user permission
 * @method req.SA.checkPermission
 * @param {Express.Request} req
 * @param {Number} action
 * @param {String} modelName
 * @returns {Boolean}
 */

module.exports = function extendRequestMiddlewareBuilder(
  sequelizeInstance,
  modelAdmins,
  translation
) {
  const modelAdminManager = new ModelAdminManager(
      sequelizeInstance,
      modelAdmins
    ),
    Sequelize = sequelizeInstance.constructor

  return (req, res, next) => {
    const modelName = url.parse(req.url, true).pathname.split('/')[2],
      modelAdminInstance = modelName
        ? modelAdminManager.getModelAdminByModelName(modelName)
        : undefined
    req.SA = Object.assign(req.SA || {}, {
      modelAdminManager,
      Sequelize,
      sequelizeInstance,
      modelName,
      modelAdminInstance,
      trModel: l10n.trModelFactory(req, translation),
      trField: l10n.trFieldFactory(req, translation),
      trAction: l10n.trActionFactory(req, translation),
      tr: l10n.trFactory(req, translation),
      checkPermission,
      getSequelizeError: (type, fieldName) => {
        return new req.SA.Sequelize.ValidationError(null, [
          new req.SA.Sequelize.ValidationErrorItem(
            `Validation ${type} on ${fieldName} failed`,
            null,
            fieldName
          )
        ])
      },
      PERMISSION,
      utils: {
        toArray: data =>
          data === undefined || data === null
            ? []
            : data instanceof Array
              ? data
              : [data],
        clip: (str, len = 100) => {
          str = str.trim().replace(/\s+/g, ' ')
          return str.length > len ? str.substr(0, len) + '…' : str
        }
      }
    })
    next()
  }
}
