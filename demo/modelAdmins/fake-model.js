const { ModelAdmin } = require('../../')

class CustomViewAdmin extends ModelAdmin {
  init() {
    this.icon = '<span class="oi oi-pie-chart"></span>'
    this.addExtraResource(
      'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.2/Chart.bundle.js'
    )
  }
  modelListRenderer(req, res, next) {
    const ma = req.SA.modelAdminManager.getModelAdminByModelName('actions')
    const labels = [],
      counts = []
    ma.model
      .findAll({ attributes: ['name', 'count'] })
      .then(entries => {
        entries.map(entry => {
          labels.push(entry.name), counts.push(entry.count)
        })
        res.pugrender(__dirname + '/../views/fakeTable.pug', {
          labels: '[' + labels.map(v => `"${v}"`).join(',') + ']',
          counts: '[' + counts.join(',') + ']',
          colors: '[' + counts.map((v,i)=>`"hsl(${i*320/counts.length}, 100%, 50%)"`).join(',') + ']',
          pageTitle: 'Чарт'
        })
      })
      .catch(next)
  }
  entryRenderer(req, res, next) {
    res.redirect(req.SA.queryExtender(['entry', 'actions', 'new']))
  }
}

module.exports = CustomViewAdmin
