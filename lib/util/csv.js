function parseIntArray (csv) {
  return csv.split(',').map(i => parseInt(i))
}

module.exports = {
  parseIntArray
}
