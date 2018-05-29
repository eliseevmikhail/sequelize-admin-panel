module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('Project', {
    name: DataTypes.STRING
  })
  Model.associate = function(models) {
    Model.belongsToMany(models.Worker, {
      through: models.WorkerProject,
      onDelete: 'CASCADE'
    })
    Model.belongsTo(models.Manager)
  }
  return Model
}
