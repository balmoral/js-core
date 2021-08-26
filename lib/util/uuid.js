const number = require('./number')
const random = require('./random')

const UUIDSET = '0123456789abcdef'
const UUIDSET_H = UUIDSET.length - 1

function uuid(length = 24) {
  var uuid = ''
  for (let i = 0; i < length; i++) {
    uuid += number.HEX_DIGITS[random.randomInt(UUIDSET_H)]
  }
  return uuid
}

module.exports = {
  uuid
}