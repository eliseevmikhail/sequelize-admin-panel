const { ModelAdmin } = require('../../')

class ProjectAdmin extends ModelAdmin {
  repr(req, entry) {
    return entry.name
  }

  init() {
    super.init()
    this.list_fields = ['id', 'name', 'Manager', 'Workers', 'createdAt']
    this.list_links = ['id', 'name']
    this.ordering = ['name']
    this.editor_fields = ['name', 'Manager', 'Workers']
    this.icon = '<span class="oi oi-task"></span>'
  }
}

class WorkerAdmin extends ModelAdmin {
  repr(req, entry) {
    return entry.name
  }

  init() {
    super.init()
    this.list_fields = ['id', 'name', 'Manager', 'Projects', 'createdAt']
    this.list_links = ['id', 'name']
    this.ordering = ['name']
    this.editor_fields = ['name', 'Manager', 'Projects']
  }
}

class ManagerAdmin extends ModelAdmin {
  repr(req, entry) {
    return entry.name
  }

  init() {
    super.init()
    this.list_fields = ['id', 'name', 'Project', 'Workers', 'createdAt']
    this.list_links = ['id', 'name']
    this.ordering = ['name']
    this.editor_fields = ['name', 'Project', 'Workers']
  }
}

module.exports = { ProjectAdmin, WorkerAdmin, ManagerAdmin }
