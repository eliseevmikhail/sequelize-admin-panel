const ModelAdmin = require('../ModelAdmin')

class UserModelAdmin extends ModelAdmin {
  init() {
    super.init()
    this.editor_fields = ['username', 'password', 'enabled', 'superuser', 'permissions']
    this.list_fields = ['username', 'enabled', 'superuser', 'createdAt', 'updatedAt']
    this.icon = '<span class="oi oi-people"></span>'
    this.addFieldDescriptions({
      password: {
        widget: 'PASSWORD'
      },
      permissions: {
        widget: (req, entry, fieldName, value) => {
          let parsedValue
          try {
            parsedValue = JSON.parse(value)
          } catch(e) {
            parsedValue = {}
            value='{}'
          }
          return req.pugrenderToString('widgets/permissions', {
            value,
            parsedValue,
            fieldName,
            modelAdmins: req.SA.modelAdminManager.modelAdminList,
            permissions: require('./permissions')
          })

        }
      }
    })
  }
  repr(req, entry) {
    return entry.username
  }
}

module.exports = UserModelAdmin
