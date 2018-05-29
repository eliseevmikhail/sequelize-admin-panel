module.exports = require('express-session')({
  secret: String.fromCharCode.apply(String, Array.apply([],
    require('crypto')
    .randomFillSync(new Uint8Array(64)))),
  name: 'sequelize-admin-panel.sid',
  cookie: {
    httpOnly: true,
    resave: false,
    saveUninitialized: false
  }
})
