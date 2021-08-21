function csvParseIntArray (csv) {
  return csv.split(',').map(i => parseInt(i))
}

module.exports = {
  csvParseIntArray
}
