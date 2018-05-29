const express = require('express')
const db = require('./models')
const { sequelizeAdmin } = require('../')
const app = express()

const models = [
  [db.Manager, require('./modelAdmins/relations').ManagerAdmin],
  [db.Worker, require('./modelAdmins/relations').WorkerAdmin],
  [db.Project, require('./modelAdmins/relations').ProjectAdmin],
  [db.customViews, require('./modelAdmins/custom-views')],
  [db.actions, require('./modelAdmins/actions')],
  [db.globalOverrides, require('./modelAdmins/global-overrides')],
  [db.fakeTable, require('./modelAdmins/fake-model')]
]

// use it first
app.use(
  '/admin',
  sequelizeAdmin(express, db.sequelize, {
    models,
    translation: Object.assign(
      {},
      require('./translations/en'),
      require('./translations/ru')
    )
  })
)

app.use('/', (req, res, next) => res.send(`<a href="/admin">Go to admin</a>`))

app.listen(process.env.PORT || 3000, () => console.log('Server started'))
