function sum (values) {
  values.reduce((accum, val) => accum + val, 0.0)
}

// Returns array of elements in array 'a' which ARE NOT present in array 'b'
function difference (a, b, cmpfn) {
  return a.filter(p => b.findIndex(q => cmpfn(p, q)) === -1)
}

// Returns elements in array 'a' which ARE present in array 'b'
function intersection (a, b, cmpfn) {
  return a.filter(p => b.findIndex(q => cmpfn(p, q)) !== -1)
}

// matchFn should return true if match, false if not
// Returns union of elements in arrays 'a' and 'b'
function union (a, b, matchFn) {
  const both = [a, b]
  const result = []
  both.forEach(c => {
    c.forEach(p => {
      if (result.findIndex(q => matchFn(p, q) === -1)) {
        result.push(p)
      }
    })
  })
  return result
}

// matchFn should return true if match, false if not given two objects to compare
function unique (array, matchFn) {
  const result = []
  array.forEach(a => {
    if (result.findIndex(b => matchFn(a, b)) === -1) {
      result.push(a)
    }
  })
  return result
}

// matchFn should return true for element to delete
// delete is done in place, and given array returned
function deleteOne(array, matchFn) {
  const i = array.findIndex(e => matchFn(e))
  if (i !== -1) array.splice(i, 1)
  return array
}

module.exports = {
  sum,
  difference,
  intersection,
  union,
  unique,
  deleteOne
}