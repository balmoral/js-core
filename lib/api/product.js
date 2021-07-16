const $string = require('../util/string.js')
const { origins, stages, status} = require('../enums/product')

function populate(product) {
  product.status = status.map[product.status_code]
  product.stage = stages.map[product.action_code]
  product.origin = origins.map[product.origin_code]
}

function sortProducts (products, prop = 'name') {
  return products.sort((a, b) => $string.cmp(a[prop], b[prop]))
}

module.exports = {
  populate,
  sortProducts
}