// resolve an enumerator code to an enumerator instance
function resolveEnum (code, enumsMap, description) {
  const e = enumsMap[code]
  if (e === undefined) {
    console.error(`api.db.resolveEnum(${code}, ${JSON.stringify(enums.map)}, ${description}) : ERROR : 1`)
    throw new Error(`could not find code ${code} in keys ${Object.keys(enums.map)} of ${description}`)
  }
  return e
}

module.exports = {
  bool: require('./bool'),
  resolveEnum
}