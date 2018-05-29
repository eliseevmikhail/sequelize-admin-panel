var pug = require('pug')
const path = require('path')

// /**
//  * @namespace req
//  * @description express request object
//  * @prop {Function} pugrenderToString(fname,locals)
//  *  find template as __dirname+'../views/'+fname and renders with locals
//  *  returns string
//  */

// /**
//  * @namespace res
//  * @description express responce object
//  * @prop {Function} pugrender(fname,locals)
//  *  find template as __dirname+'../views/'+fname, renders with locals and send
//  */

/**
 * @namespace req
 */

/**
 * @namespace res
 */

function abspath(fname) {
  if (fname.charAt(0) === '/') return fname
  return path.join(__dirname, '../views', fname) + '.pug'
}

module.exports = (req, res, next) => {
  /**
   * Find template at __dirname+'../views/' and renders with locals
   * @method req.pugrenderToString
   * @param {String} fname template name
   * @param {Object} locals template locals
   */
  req.pugrenderToString = (fname, locals) => {
    return pug.renderFile(
      abspath(fname),
      Object.assign({}, locals, {
        req
      })
    )
  }
  /**
   * Find template at __dirname+'../views/', renders with locals and send
   * @method res.pugrender
   * @param {String} fname template name
   * @param {Object} locals template locals
   */
  res.pugrender = (fname, locals) => {
    res.send(
      pug.renderFile(
        abspath(fname),
        Object.assign({}, locals, {
          req
        })
      )
    )
  }
  next()
}
