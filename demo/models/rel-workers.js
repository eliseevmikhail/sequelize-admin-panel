module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('Worker', {
    name: DataTypes.STRING
  })
  Model.associate = function(models) {
    Model.belongsToMany(models.Project, {
      through: models.WorkerProject,
      onDelete: 'CASCADE'
    })
    Model.belongsTo(models.Manager)
  }
  return Model
}
