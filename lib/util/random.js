const number = require('./number')

function int(max = Number.MAX_SAFE_INTEGER) {
  return Math.round(Math.random() * max)  
}

function intBetween(min, max) {
  if (min > max) return intBetween(max, min)
  return min + Math.round(Math.random() * (max - min))  
}

function element(array) {
  return array[randomInt(array.length)]
}

function property(obj) {
  const keys = Object.keys(obj)
  return obj[element(keys)]
}

// Argument may be an array or string (or indexable object with slice() method).
// Returns a new array or string which is a shuffled version of the argument.
function shuffle(arg) {
  const isString = typeof arg === 'string'
  const result = isString ? arg.split('') : arg.slice(0)
  let m = result.length, i, tmp
  while (m) {
    i = ((Math.random() * m--) >>> 0) // faster than round?
    tmp = result[m]
    result[m] = result[i]
    result[i] = tmp
  }
  return isString ? result.join('') : result
}

function uuid(length = 16) {
  var uuid = ''
  const h = number.HEX_DIGITS.length - 1
  for (let i = 0; i < length; i++) {
    uuid += number.HEX_DIGITS[int(h)]
  }
  return uuid
}

module.exports = {
  int,
  intBetween,
  element,
  property,
  shuffle,
  uuid
}