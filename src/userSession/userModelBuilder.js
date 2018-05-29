const passwordHash = require('password-hash')

const userModelName = 'sequelize_admin_user'
let UserModel = null

function userModelBuilder(sequelizeInstance) {
  if (!UserModel) {
    const Sequelize = sequelizeInstance.constructor
    UserModel = sequelizeInstance.define(userModelName, {
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '',
        unique: true,
        validate: {
          not: 'EMERGENCY',
          len: [1,20]
        }
      },
      enabled: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      superuser: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      password_hash: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ''
      },
      password: {
        type: Sequelize.VIRTUAL,
        validate: {
          len: [4,20]
        },
        set(password) {
          this.setDataValue('password', password)
          if (password) this.setDataValue('password_hash', passwordHash.generate(password))
        },
      },
      permissions: {
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: '{}',
      }
    })
    UserModel.prototype.checkPassword = function (password) {
      return passwordHash.verify(password, this.getDataValue('password_hash'))
    }
  }
  return UserModel
}

userModelBuilder.userModelName = userModelName
module.exports = userModelBuilder
