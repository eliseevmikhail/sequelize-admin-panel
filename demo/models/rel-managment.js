module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('Manager', {
    name: DataTypes.STRING
  })
  Model.associate = function(models) {
    Model.hasMany(models.Worker, { onDelete: 'CASCADE' })
    Model.hasOne(models.Project, { onDelete: 'CASCADE' })
  }
  return Model
}
