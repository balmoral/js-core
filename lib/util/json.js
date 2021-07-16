/* 
** Returns a JSON string from the given object.
** Handles circular references.
**
** If no circular refs use objectToJSON or JSON.stringify
*/
function circularObjectToJSON(obj) {
  const getCircularReplacer = () => {
    const seen = new WeakSet()
    let count = 0
    return (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          count += 1
          return `circular#${count}:${Object.keys(value)}`
        }
        seen.add(value)
      }
      return value
    }
  }
  return JSON.stringify(obj, getCircularReplacer())
}

function objectToJSON(obj) {
  JSON.stringify(obj)
}

module.exports = {
  objectToJSON,
  circularObjectToJSON
}