module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('globalOverrides', {
    name: DataTypes.STRING,
    file: DataTypes.BLOB
  }, {})
  Model.associate = function (models) {
    // Model.hasMany(models.Associations, {as: 'employees'})
  }
  return Model
}
