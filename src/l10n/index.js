const objectPath = require('object-path')
const deepAssign = require('deep-assign')

const defaultLocale = 'en'
const defaultTranslation = require('./' + defaultLocale)

function getClientLocale(req) {
  return req.acceptsLanguages()[0]
}

function trModelFactory(req, translation) {
  const userLocale = getClientLocale(req)
  translation = deepAssign(defaultTranslation, translation)
  return modelAdmin => {
    if (!modelAdmin.namePlural)
      modelAdmin = req.SA.modelAdminManager.getModelAdminByModelName(
        modelAdmin.name
      )
    const ret = {
      label: modelAdmin.name,
      plural: modelAdmin.namePlural,
      hint: '',
      toString: function() {
        return this.label
      }
    }
    Object.defineProperty(ret, 'toString', { enumerable: false })

    const userTr =
      objectPath.get(translation, [userLocale, 'models', modelAdmin.name]) || {}
    ;['label', 'plural', 'hint'].map(type => {
      let defTr
      if (!userTr[type] && userLocale !== defaultLocale) {
        defTr = objectPath.get(translation, [
          defaultLocale,
          'models',
          modelAdmin.name,
          type
        ])
        if (defTr != undefined) ret[type] = defTr
      } else ret[type] = userTr[type]
    })
    return ret
  }
}

function trFieldFactory(req, translation) {
  const userLocale = getClientLocale(req)
  translation = deepAssign(defaultTranslation, translation)
  return (modelName, fieldName, def) => {
    let str = objectPath.get(translation, [
      userLocale,
      'models',
      modelName,
      'fields',
      fieldName
    ])
    if (!str && userLocale !== defaultLocale)
      str = objectPath.get(translation, [
        defaultLocale,
        'models',
        modelName,
        'fields',
        fieldName
      ])
    return str !== undefined ? str : def !== undefined ? def : fieldName
  }
}

function trFactory(req, translation) {
  const userLocale = getClientLocale(req)
  translation = deepAssign(defaultTranslation, translation)
  return (term, def) => {
    let str = objectPath.get(translation, [userLocale, 'ui', term])
    if (!str && userLocale !== defaultLocale)
      str = objectPath.get(translation, [defaultLocale, 'ui', term])
    return str !== undefined ? str : def !== undefined ? def : term
  }
}

function trActionFactory(req, translation) {
  const userLocale = getClientLocale(req)
  translation = deepAssign(defaultTranslation, translation)
  return (term, def) => {
    let str = objectPath.get(translation, [userLocale, 'actions', term])
    if (!str && userLocale !== defaultLocale)
      str = objectPath.get(translation, [defaultLocale, 'actions', term])
    return str !== undefined ? str : def !== undefined ? def : term
  }
}

module.exports = {
  trModelFactory,
  trFieldFactory,
  trActionFactory,
  trFactory,
  defaultLocale,
  defaultTranslation
}
