const number = require('../../util/number')

/*
Production batch sizing:
  * none
    * min = max = step = 0
  * fixed
    * min > 0, min = max, step = 0
  * variable
    * min > 0, max > min, step = 0
  * stepped
    * min > 0, max > min, step > 0
    * min and max are multiples of step

BatchSizing properties
{
  type,
  label,
  min,
  max,
  step,
  partial,
  isNone,
  isFixed,
  isVariable,
  isStepped,
  isPartial
}
*/

const NONE_CODE = 'None'
const FIXED_CODE = 'Fixed'
const VARIABLE_CODE = 'Variable'
const STEPPED_CODE = 'Stepped'
const ALL_CODES = [ NONE_CODE, FIXED_CODE, VARIABLE_CODE, STEPPED_CODE ]
const DEFAULT_MAX_SIZE = 80

function instantiate(type, min, max, step = 0, partial = false) {
  return {
    type: type,
    label: type,
    min: min,
    max: max,
    step: step,
    partial: partial,
    // for convenience
    isNone: type === NONE_CODE,
    isFixed: type === FIXED_CODE,
    isVariable: type === VARIABLE_CODE,
    isStepped: type === STEPPED_CODE,
    isPartial: partial
  }
}

function none() {
  const inst = instantiate(NONE_CODE, 0, 0, 0)
  return inst
}

function fixed(batch_size = DEFAULT_MAX_SIZE, partial = false) {
  return instantiate(FIXED_CODE, batch_size, batch_size, 0, partial)
}

function variable(min = 1, max = DEFAULT_MAX_SIZE) {
  return instantiate(VARIABLE_CODE, TYPE, min, max)
}

function stepped(step = 4, nsteps = null) {
  return instantiate(STEPPED_CODE, step, nsteps === null ? step * 20 : step * nsteps, step)
}

// Returns an string with error messages separated by "\n" if params don't suit type (type).
// Returns null if no error.
function validate(type, min, max, step, partial = false) {
  if (type === FIXED_CODE) {
    if (min <= 0) return `${type} batch size must be greater than zero.`
  } else if (type === VARIABLE_CODE || type === STEPPED_CODE) {
    const errors = []
    if (min >= max) errors.push(`${type} batch minimum must be less than the maximum.`)
    if (type === STEPPED_CODE) {
      if (!number.isMultiple(step, min))
        errors.push(`${type} batch minimum must be a multiple of the batch step size.`)
      if (!number.isMultiple(step, max))
        errors.push(`${type} batch maximum must be a multiple of the batch step size.`)
    }
    if (partial) errors.push(`Only ${FIXED_CODE} size batches may be partial.`)
    if (errors.length > 0) return errors.join('\n')
  } 
  return null     
}

function normalise(type, min, max, step, partial) {
  const error = validate(type, min, max, step, partial)
  if (error) throw new Error(error)
  switch(type) {
    case NONE_CODE: 
      return none()
    case FIXED_CODE:
      return fixed(min, partial)
    case VARIABLE_CODE:
      return variable(min, max)
    case STEPPED_CODE:
      return stepped(min, step, max)
    default:
      throw new Error(`unhandled batch size type ${type}'`)
  }
}

module.exports = {
  NONE_CODE,
  FIXED_CODE,
  VARIABLE_CODE,
  STEPPED_CODE,
  ALL_CODES,
  DEFAULT_MAX_SIZE,
  none,
  fixed,
  variable,
  stepped,
  validate,
  normalise
}
