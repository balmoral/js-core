/*
User groups:
  * administrator
  * manager
  * staff
*/

const ADMINISTRATOR_CODE = 'administrator'
const MANAGER_CODE = 'manager'
const STAFF_CODE = 'staff'

const WRITE_PERMISSION_CODE = 'write' // implies read
const READ_PERMISSION_CODE = 'read'
const NO_PERMISSION_CODE = 'none'

function instantiate(code, label) {
  const isAdmin = code === ADMINISTRATOR_CODE
  const isMgr = code === MANAGER_CODE
  return {
    code: code,
    label: label,
    isAdministrator: isAdmin,
    isManager: isMgr,
    isStaff: code === STAFF_CODE,
    permissions: {
      users: isAdmin ? WRITE_PERMISSION_CODE : NO_PERMISSION_CODE ,
      database: isAdmin ? WRITE_PERMISSION_CODE : NO_PERMISSION_CODE,
      logs: isAdmin ? WRITE_PERMISSION_CODE : NO_PERMISSION_CODE,
      products: isAdmin || isMgr ? WRITE_PERMISSION_CODE : READ_PERMISSION_CODE,
      customers: isAdmin || isMgr ? WRITE_PERMISSION_CODE : READ_PERMISSION_CODE,
      orders: isAdmin|| isMgr ? WRITE_PERMISSION_CODE : NO_PERMISSION_CODE,
      invoices: isAdmin || isMgr ? WRITE_PERMISSION_CODE : NO_PERMISSION_CODE,
      production_schedules: isAdmin || isMgr ? WRITE_PERMISSION_CODE : READ_PERMISSION_CODE,
      production_runs: READ_PERMISSION_CODE,
    }
  }
}

const administrator = instantiate(ADMINISTRATOR_CODE, 'Administrator')
const manager = instantiate(MANAGER_CODE, 'Manager')
const staff = instantiate(STAFF_CODE, 'Staff')
const all = [administrator, manager, staff]
const map = {}
all.forEach(x => map[x.code] = x)
const DEFAULT = staff

module.exports = {
  ADMINISTRATOR_CODE,
  MANAGER_CODE,
  STAFF_CODE,
  WRITE_PERMISSION_CODE,
  READ_PERMISSION_CODE,
  NO_PERMISSION_CODE,
  administrator,
  manager,
  staff,
  all,
  map,
  DEFAULT
}
