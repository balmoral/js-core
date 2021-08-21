import { HEX_DIGITS }  from './number'
import { randomInt }  from './random'

export function uuid(length = 16) {
  var uuid = ''
  const h = number.HEX_DIGITS.length - 1
  for (let i = 0; i < length; i++) {
    uuid += number.HEX_DIGITS[randomInt(h)]
  }
  return uuid
}