const getAssociations = require('../../utils/getAssociations')

function noUndef(value, def) {
  return value === undefined || value === null ? def : value
}

function defaultView(req, entry, fieldName) {
  let out = String(noUndef(entry[fieldName], ''))
  return req.SA.utils.clip(out, 100)
}

function toOneView(req, entry, fieldName) {
  const { targetModelAdmin, targetGetter } = getAssociations(
    req,
    entry,
    fieldName
  )
  return entry[targetGetter]().then(
    targetEntry => (targetEntry ? targetModelAdmin.repr(req, targetEntry) : '')
  )
}

function toManyView(req, entry, fieldName) {
  const { targetModelAdmin, targetGetter } = getAssociations(
    req,
    entry,
    fieldName
  )
  return entry[targetGetter](targetModelAdmin.genSequelizeQueryOrderClause())
    .then(
      targetEntries =>
        targetEntries
          ? Promise.all(
              targetEntries.map(targetEntry =>
                targetModelAdmin.repr(req, targetEntry)
              )
            )
          : []
    )
    .then(targetReprList => {
      return (
        '[' +
        (targetReprList.length > 10
          ? targetReprList.slice(0, 10).concat(['…'])
          : targetReprList
        ).join(', ') +
        ']'
      )
    })
}

module.exports = {
  STRING: defaultView,
  TEXT: defaultView,
  INTEGER: defaultView,
  BIGINT: defaultView,
  FLOAT: defaultView,
  REAL: defaultView,
  DOUBLE: defaultView,
  DECIMAL: defaultView,
  DATE: (req, entry, fieldName) => entry[fieldName].toISOString(),
  DATEONLY: defaultView,
  BOOLEAN: (req, entry, fieldName) =>
    entry[fieldName] === null ? '' : entry[fieldName] === true ? '☑' : '☐',
  JSON: defaultView,
  JSONB: defaultView,
  BLOB: defaultView,
  UUID: defaultView,
  ARRAY: defaultView,
  GEOMETRY: defaultView,
  BelongsTo: toOneView,
  HasOne: toOneView,
  HasMany: toManyView,
  BelongsToMany: toManyView
}
