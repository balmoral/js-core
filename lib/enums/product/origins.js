/*
Product origins:
  * produced
  * supplied

Origin properties
{
  code,
  label,
  isProduced,
  isSupplied
}
*/

const PRODUCED_CODE = 'P'
const SUPPLIED_CODE = 'S'

function instantiate(code, label) {
  return {
    code: code,
    label: label,
    isProduced: code === PRODUCED_CODE,
    isSupplied: code === SUPPLIED_CODE
  }
}

const produced = instantiate(PRODUCED_CODE, 'Produced')
const supplied = instantiate(SUPPLIED_CODE, 'Supplied')
const all = [supplied, produced]
const map = {}
all.forEach(x => map[x.code] = x)
const DEFAULT = produced

module.exports = {
  PRODUCED_CODE,
  SUPPLIED_CODE,
  produced,
  supplied,
  all,
  map,
  DEFAULT
}

