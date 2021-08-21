const number = require('./number')
const random = require('./random')

function uuid(length = 16) {
  var uuid = ''
  const h = number.HEX_DIGITS.length - 1
  for (let i = 0; i < length; i++) {
    uuid += number.HEX_DIGITS[random.randomInt(h)]
  }
  return uuid
}

module.exports = {
  uuid
}