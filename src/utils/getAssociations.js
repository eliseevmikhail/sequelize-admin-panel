/**
 * Get associated field props
 * @private
 * @param {Express.Request} req 
 * @param {Sequelize.ModelInstance} entry 
 * @param {string} fieldName 
 * @returns {associations}
 */
function getAssociations(req, entry, fieldName) {
  const
  sourceModel = entry.constructor,
  sourceModelAdmin = req.SA.modelAdminManager.getModelAdminByModelName(sourceModel.name),
  targetModel = sourceModel.associations[fieldName].target,
  targetModelAdmin = req.SA.modelAdminManager.getModelAdminByModelName(targetModel.name),
  targetGetter = sourceModel.associations[fieldName].accessors.get,
  targetSetter = sourceModel.associations[fieldName].accessors.set
  return {
    sourceModel,
    sourceModelAdmin,
    targetModel,
    targetModelAdmin,
    targetGetter,
    targetSetter
  }
}

/**
 * @private
 * @typedef associations
 * @type {object}
 * @prop {ModelAdmin} sourceModelAdmin 
 * @prop {Sequelize.Model} sourceModel 
 * @prop {ModelAdmin} targetModelAdmin
 * @prop {Sequelize.Model} targetModel 
 * @prop {function} targetGetter
 * @prop {function} targetSetter
 */

module.exports = getAssociations
