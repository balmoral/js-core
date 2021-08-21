const number = require('./number')

export function randomInt(max = number.MAX_SAFE_INTEGER) {
  return Math.round(Math.random() * max)  
}

export function randomIntBetween(min, max) {
  if (min > max) return intBetween(max, min)
  return min + Math.round(Math.random() * (max - min))  
}

export function randomElement(array) {
  return array[randomInt(array.length)]
}

export function randomProperty(obj) {
  const keys = Object.keys(obj)
  return obj[element(keys)]
}

// Argument may be an array or string (or indexable object with slice() method).
// Returns a new array or string which is a shuffled version of the argument.
export function shuffle(arg) {
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

module.exports = {
  randomInt,
  randomIntBetween,
  randomElement,
  randomProperty,
  shuffle
}