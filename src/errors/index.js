class PermissionError extends Error {
  constructor(message) {
    super()
    this.name = 'PermissionError'
    this.message = message || 'permission denied'
  }
}

module.exports = {PermissionError}