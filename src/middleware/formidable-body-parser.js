const formidable = require('formidable')
module.exports = opts => (req, res, next) => {
  const form = new formidable.IncomingForm(opts)
  req.body = {}
  form
    .parse(req, (err, fields, files) => {
      req.files = files
      next()
    })
    .on('field', function(name, field) {
      if (req.body[name] === undefined) req.body[name] = field
      else if (req.body[name] instanceof Array) req.body[name].push(field)
      else req.body[name] = [req.body[name], field]
    })
}
