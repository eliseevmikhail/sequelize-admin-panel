module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('', {
    name: DataTypes.STRING,
  }, {})
  Model.associate = function (models) {
    // Model.hasMany(models.Associations, {as: 'employees'})
  }
  return Model
}
