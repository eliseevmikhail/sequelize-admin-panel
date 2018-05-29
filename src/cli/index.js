/** @module cli */
/* eslint no-case-declarations: 0, no-console: 0 */
const path = require('path')
const { defaultLocale, defaultTranslation } = require('../l10n')

const exec = path.basename(process.argv[1]),
  command = process.argv[2],
  options = process.argv.slice(3)

function help() {
  console.error(`Usage: ${process.argv0} ${exec} command [options]
  Commands:
    dumptranslation [--empty] [--hints] - show translation skeleton
    createsuperuser user password       - create superuser
    init [--all]                        - (re)create user table or all tables, drop all data`)
}

function dumpTranslations(sequelizeInstance, empty = false, hints = false) {
  if (empty)
    Object.keys(defaultTranslation[defaultLocale].ui).map(
      key => (defaultTranslation[defaultLocale].ui[key] = '')
    )
  Object.keys(sequelizeInstance.models).map(modelName => {
    const model = sequelizeInstance.models[modelName]
    const fields = Object.keys(model.attributes)
      .filter(fName => !model.attributes[fName].references)
      .concat(Object.keys(model.associations))
    defaultTranslation[defaultLocale].models = Object.assign(
      defaultTranslation[defaultLocale].models || {},
      {
        [model.name]: {
          label: empty ? '' : model.options.name.singular,
          plural: empty ? '' : model.options.name.plural,
          [hints ? 'hint' : undefined]: '',
          fields: fields.reduce(
            (acc, curr) =>
              Object.assign(acc, {
                [curr]: empty ? '' : curr,
                [hints ? curr + '_hint' : undefined]: ''
              }),
            {}
          )
        }
      }
    )
  })
  defaultTranslation[defaultLocale].actions = {
    delete: 'Delete'
  }
  return JSON.stringify(defaultTranslation, null, 2)
}

/**
 * node cli -h
 * @method cli
 * @param {Sequelize} sequelizeInstance db connection
 */
module.exports = function cli(sequelizeInstance) {
  const User = require('../userSession').userModelBuilder(sequelizeInstance)
  switch (command) {
    case 'dumptranslation':
      console.log(
        dumpTranslations(
          sequelizeInstance,
          options.includes('--empty'),
          options.includes('--hints')
        )
      )
      break
    case 'createsuperuser':
      const [username, password] = options
      if (username && password) {
        User.create(
          {
            username,
            password,
            superuser: true,
            enabled: true
          },
          {
            logging: false
          }
        )
          .then(() => console.log(`User ${username} created`))
          .catch(e => console.error(e.name, e.message))
          .then(() => sequelizeInstance.close())
      } else help()
      break
    case 'init':
      const object = options[0] === '--all' ? sequelizeInstance : User,
        message =
          options[0] === '--all'
            ? 'All tables are initialized'
            : 'User table is initialized'
      object
        .sync({
          force: true,
          logging: false
        })
        .then(() => console.log(message))
        .catch(e => console.error(e.name, e.message))
        .then(() => sequelizeInstance.close())
      break
    default:
      help()
  }
}
