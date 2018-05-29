module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('customViews', {
    position: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '55.75027920193085,37.622483042183035',
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '#ff0000',
    },
    smile: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '128513',
    }
  }, {})
  Model.associate = function (models) {
    // Model.hasMany(models.Associations, {as: 'employees'})
  }
  return Model
}
