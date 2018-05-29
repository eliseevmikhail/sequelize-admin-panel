const { ModelAdmin } = require('../../')

class CustomViewAdmin extends ModelAdmin {
  repr(req, entry) {
    return entry.name
  }

  init() {
    super.init()
    this.list_fields = ['name', 'count', 'state']
    this.list_links = ['name']
    this.editor_fields = ['name', 'count', 'state']
    this.icon = '<span class="oi oi-media-play"></span>'
    this.ordering = ['name']
    this.actions = [
      {
        // renderer example
        name: 'zerofy_count',
        renderer: (req, res, modelAdmin, ids, exit) => {
          let transaction
          return req.SA.sequelizeInstance
            .transaction()
            .then(_transaction => (transaction = _transaction))
            .then(() =>
              modelAdmin.model.update(
                { count: 0 },
                { where: { [modelAdmin.pkName]: ids }, transaction }
              )
            )
            .then(() => transaction.commit())
            .catch(() => transaction.rollback())
            .then(() => exit())
        }
      },
      {
        // changer example
        name: 'randomize_count',
        changer: entry => entry.count = Math.round(Math.random() * 1000)
      },
      {
        name: 'uppercase_name',
        changer: entry => entry.name = entry.name.toUpperCase()
      },
      {
        name: 'toggle_state',
        changer: entry => entry.state = !entry.state
      }
    ]
  }
}

module.exports = CustomViewAdmin
