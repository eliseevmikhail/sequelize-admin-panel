const querystring = require('querystring')
const escape = require('escape-html')
// const deepAssign = require('deep-assign')
const path = require('path')

const paramsList = ['sort', 'page', 'search', 'subwindow', 'action', 'entryIds', 'backurl']

function extendParams(req, extraParams, unsetParams) {
  let oldParams = Object.assign({}, req.SA.params)
  if (unsetParams instanceof Array)
    unsetParams.map(param => delete oldParams[param])
  else if (unsetParams instanceof String) delete oldParams[unsetParams]
  else if (unsetParams === false) oldParams = {}
  return Object.assign({}, oldParams, extraParams)
}

function queryExtender(req) {
  /**
   * @method req.SA.queryExtender
   * @param {Array} pathParts url parts
   * @param {Object} extraParams new url params
   * @param {Array|String} unsetParams params to unset, false means unset all
   * @returns {String} url
   */
  return function(pathParts = [], extraParams = {}, unsetParams = []) {
    const newParams = extendParams(req, extraParams, unsetParams)
    return (
      path.join(req.baseUrl, ...pathParts.map(p => String(p))) +
      (Object.keys(newParams).length
        ? '?' +
          querystring.stringify({
            params: JSON.stringify(newParams)
          })
        : '')
    )
  }
}

function formExtender(req) {
  /**
   * @method req.SA.formExtender
   * @param {Object} extraParams new form params
   * @param {Array|String} unsetParams params to unset, false means unset all
   * @returns {String} html, set of hidden form inputs with params
   */
  return function(extraParams = {}, unsetParams = []) {
    const newParams = extendParams(req, extraParams, unsetParams)
    return (
      '<input type="hidden" name="params" value="' +
      escape(JSON.stringify(newParams)) +
      '"/>'
    )
  }
}

module.exports = (req, res, next) => {
  req.SA = Object.assign(req.SA || {}, {
    params: {},
    queryExtender: queryExtender(req),
    formExtender: formExtender(req)
  })
  req.SA.params = JSON.parse(
    (req.body || {}).params || (req.query || {}).params || '{}'
  )
  Object.assign(
    req.SA.params,
    paramsList.reduce((acc, param) => {
      ;(req.body || {})[param]
        ? (acc[param] = req.body[param])
        : (req.query || {})[param]
          ? (acc[param] = req.query[param])
          : null
      return acc
    }, {})
  )
  next()
}
