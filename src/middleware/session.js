module.exports = require('express-session')({
  secret: Math.random().toString(36),
  name: 'sequelize-admin-panel.sid',
  cookie: {
    httpOnly: true,
    resave: false,
    saveUninitialized: false
  }
})
