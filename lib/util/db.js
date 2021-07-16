/*
 * database utility functions
 */

// toObjs maybe array or Map.
// If map it should be keyed by expected values of fromObj[fromProp] and toProp will be ignore
function resolveJoin (fromName, fromObj, fromProp, toName, toObjs, toProp = '_id') {
  const fromVal = fromObj[fromProp]
  const result = toObjs instanceof Map
    ? toObjs.get(fromVal)
    : toObjs.find(e => e[toProp] === fromVal)
  if (result === undefined) {
    throw new Error(`resolveJoin failed: ${fromName}.${fromProp}=${fromVal} not found in ${toObjs.length} ${toName}.${toProp}`)
  }
  return result
}

// return a Map of given objects keyed by their _ids
function objectsById (objects) {
  // console.log(`api.db.objectsById() : 1 : objects.length=${objects.length}`)
  const map = new Map()
  // console.log('api.db.objectsById() : 2')
  objects.forEach(obj => map.set(obj._id, obj))
  // console.log(`api.db.objectsById() : 3 : returning map.size ${map.size} `)
  return map
}

module.exports = {
  resolveJoin,
  objectsById
}