const promiseAllProps = require('promise-all-props')
const getAssociations = require('../../utils/getAssociations')

function noUndef(value, def) {
  return value === undefined || value === null ? def : value
}

function widgetBuilder(template, def) {
  return function(req, entry, fieldName, value, options) {
    return req.pugrenderToString(template, {
      value: noUndef(value, def),
      options,
      fieldName
    })
  }
}

function associationWidgetBuilder(template) {
  return (req, entry, fieldName, selectedEntryIds, options) => {
    const { targetModelAdmin } = getAssociations(req, entry, fieldName)
    return targetModelAdmin
      .getAllEntries()
      .then(targetEntries =>
        Promise.all(
          targetEntries.map(targetEntry =>
            promiseAllProps({
              pk: targetEntry[targetModelAdmin.pkName],
              value: targetModelAdmin.repr(req, targetEntry),
              selected: selectedEntryIds.includes(
                targetEntry[targetModelAdmin.pkName]
              )
            })
          )
        )
      )
      .then(targetsReprObjectList =>
        req.pugrenderToString(template, {
          list: targetsReprObjectList,
          options,
          fieldName
        })
      )
  }
}

module.exports = {
  STRING: widgetBuilder('widgets/string', ''),
  TEXT: widgetBuilder('widgets/text', ''),
  INTEGER: widgetBuilder('widgets/number', 0),
  BIGINT: widgetBuilder('widgets/number', 0),
  FLOAT: widgetBuilder('widgets/float', 0),
  REAL: widgetBuilder('widgets/float', 0),
  DOUBLE: widgetBuilder('widgets/float', 0),
  DECIMAL: widgetBuilder('widgets/float', 0),
  DATE: widgetBuilder('widgets/datetime', null),
  DATEONLY: widgetBuilder('widgets/string', ''),
  BOOLEAN: widgetBuilder('widgets/boolean', false),
  JSON: widgetBuilder('widgets/string', ''),
  JSONB: widgetBuilder('widgets/string', ''),
  BLOB: widgetBuilder('widgets/text', ''),
  UUID: widgetBuilder('widgets/string', ''),
  ARRAY: widgetBuilder('widgets/string', ''),
  GEOMETRY: widgetBuilder('widgets/string', ''),
  BelongsTo: associationWidgetBuilder('widgets/belongsTo'),
  HasOne: associationWidgetBuilder('widgets/belongsTo'),
  HasMany: associationWidgetBuilder('widgets/hasMany'),
  BelongsToMany: associationWidgetBuilder('widgets/hasMany'),
  PASSWORD: widgetBuilder('widgets/password', '')
}
