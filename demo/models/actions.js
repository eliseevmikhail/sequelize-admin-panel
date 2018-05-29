module.exports = (sequelize, DataTypes) => {
  const Model = sequelize.define('actions', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    state: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  })
  Model.associate = function(models) {
    // Model.hasMany(models.Associations, {as: 'employees'})
  }
  return Model
}
