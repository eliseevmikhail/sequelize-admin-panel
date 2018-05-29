const ModelAdmin = require('../ModelAdmin')
const { userModelBuilder, UserModelAdmin } = require('../userSession')

/**
 * @class Manage ModelAdmin instances
 */
class ModelAdminManager {
  /**
   * @constructs ModelAdminManager
   * @param {Sequelize.Instance}
   * @param {ModelAdminManager~modelAdmins}
   */
  constructor(sequelizeInstance, modelAdmins = []) {
    this._modelList = []
    this._modelMap = {}
    this._modelAdminList = []

    const User = userModelBuilder(sequelizeInstance)
    modelAdmins.map(arr => {
      const [model, modelAdminClass = ModelAdmin] = arr
      this._modelList.push(model.name)
      this._modelMap[model.name] = { model, modelAdminClass }
    })
    Object.keys(sequelizeInstance.models)
      .map(modelName => sequelizeInstance.models[modelName])
      .filter(model => model.name !== User.name && !this._modelMap[model.name])
      .map(model => {
        this._modelMap[model.name] = { model, modelAdminClass: ModelAdmin }
        if (!modelAdmins.length) this._modelList.push(model.name)
      })
    this._modelList.push(User.name)
    this._modelMap[User.name] = { model: User, modelAdminClass: UserModelAdmin }
    Object.keys(this._modelMap).map(modelName => {
      const { modelAdminClass, model } = this._modelMap[modelName]
      this._modelMap[modelName].modelAdmin = new modelAdminClass(
        model
      ).postInit()
    })
    this._modelList.map(modelName =>
      this._modelAdminList.push(this._modelMap[modelName].modelAdmin)
    )
  }

  /**
   * Get ModelAdmin instance by model name
   * @param {string} modelName model name
   * @returns instance of {@link ModelAdmin}
   */
  getModelAdminByModelName(modelName) {
    return (this._modelMap[modelName] || {}).modelAdmin
  }

  /**
   * property getter for {@link ModelAdmin} instances, same order it was passed to constructor
   * @type {array<ModelAdmin>}
   * @readonly
   */
  get modelAdminList() {
    return this._modelAdminList
  }
}

module.exports = ModelAdminManager

/**
 * Array of two-elements arrays with Sequelize.Model and ModelAdmin members, e.g.
 * <pre>[
 *  [ItemModel, ItemAdminModel],
 *  ...
 * ]</pre>
 * @typedef ModelAdminManager~modelAdmins
 * @type {Array<Array<Sequelize.Model, ModelAdmin>>}
 */
