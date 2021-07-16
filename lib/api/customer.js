const $string = require('../util/string')

module.exports = {

  legacy: {
    hasXeroInvoicing: customer => customer.xero_invoicing === 'Y',
  
    setXeroInvoicing: (customer, _bool) => customer.xero_invoicing = _bool ? 'Y' : 'N'
  },

  hasXeroInvoicing: customer => customer.xero_invoicing,
  
  setXeroInvoicing: (customer, _bool) => customer.xero_invoicing = _bool,

  hasDelivery: customer => customer.delivery_run.length > 0,
  
  hasXeroId: customer => {
    return customer.xero_invoicing !== undefined && customer.xero_invoicing.length > 0
  },

  sortCustomers: (customers, prop = 'name') => {
    return customers.sort((a, b) => $string.cmp(a[prop], b[prop]))
  }
}
