/*
Product (recipe) measures:
  * bakers
  * actual (percentage)

Origin properties
{
  code,
  label,
  isBakers,
  isActual
}
*/

const BAKERS_CODE = 'B'
const ACTUAL_CODE = 'A'

function instantiate(code, label) {
  return {
    code: code,
    label: label,
    isBakers: code === BAKERS_CODE,
    isActual: code === ACTUAL_CODE,
  }
}

const bakers = instantiate(BAKERS_CODE, 'Bakers')
const actual = instantiate(ACTUAL_CODE, 'Actual')
const all = [bakers, actual]
const map = {}
all.forEach(x => map[x.code] = x)
const DEFAULT = bakers

module.exports = {
  BAKERS_CODE,
  ACTUAL_CODE,
  bakers,
  actual,
  all,
  map,
  DEFAULT
}