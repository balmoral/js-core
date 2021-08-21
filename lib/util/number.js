export const HEX_DIGITS = '0123456789ABCDEF'

export function isMultiple(numerator, denominator) {
  return denominator !== 0 && (numerator % denominator) === 0
}
