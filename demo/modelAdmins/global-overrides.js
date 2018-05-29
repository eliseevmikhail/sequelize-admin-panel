const { ModelAdmin } = require('../../')
const fs = require('fs')

class CustomTypes extends ModelAdmin {
  init() {
    super.init()
    this.overrideTypeView('X_FILEBLOB', (req, entry, fieldName) => {
      return entry[fieldName]
        ? req.SA.tr('File size:') + entry[fieldName].length
        : req.SA.tr('No file')
    })
    this.overrideTypeWidget(
      'X_FILEBLOB',
      (req, entry, fieldName, value, options) => {
        return `<input type="file" class="form-control"
        ${options.readOnly ? 'disabled' : ''}
        name="${fieldName}" onchange="$('[name=\\'name\\']').val(this.files[0].name)"/>`
      }
    )
    this.overrideTypeSetter(
      'X_FILEBLOB',
      (req, entry, fieldName, transaction) => {
        return new Promise((resolve, reject) => {
          const file = req.files[fieldName]
          if (!file.name) reject(req.SA.getSequelizeError('file exist', fieldName))
          else {
            if (file.size > 1048576)
              reject(req.SA.getSequelizeError('file length', fieldName))
            else
              fs.readFile(file.path, (err, buf) => {
                if (err) reject(err)
                else {
                  entry[fieldName] = buf
                  resolve()
                }
              })
          }
        })
      }
    )
  }
}

class OverridedAdmin extends CustomTypes {
  repr(req, entry) {
    return entry.name
  }

  init() {
    super.init()
    this.list_fields = ['name', 'file']
    this.list_links = ['name']
    this.editor_fields = ['file', 'name']
    this.icon = '<span class="oi oi-data-transfer-upload"></span>'
    this.ordering = ['name']
    this.addFieldDescriptions({
      file: {
        view: 'X_FILEBLOB',
        widget: 'X_FILEBLOB',
        setter: 'X_FILEBLOB'
      }
    })
  }
}

module.exports = OverridedAdmin
