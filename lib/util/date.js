// https://quasar.dev/quasar-utils/date-utils
// TODO: Quasar has many date utilities built-in

const $qdate = require('./quasar-clone/date')
const $unicode = require('./unicode')

const YYYYMMDD = 'YYYYMMDD'
const YYYYMMDD_DASH = 'YYYY-MM-DD'
const YYYYMMDD_SLASH = 'YYYY/MM/DD'
const DAY_MONTH_NAME_SHORT = 'DD MMM'
const DAY_MONTH_NAME_SHORT_YEAR = 'DD MMM YYYY'
const DAY_MONTH_NAME_LONG = 'DD MMMM'
const DAY_MONTH_NAME_LONG_YEAR = 'DD MMMM YYYY'
const DEFAULT_FORMAT = YYYYMMDD_DASH
const NEARBY_WEEKS_SEPARATOR = ` ${$unicode.ARROW_RIGHT} `
const DEFAULT_N_NEARBY_WEEKS = 9

function extractDate (dateString, argFmt = undefined) {
  var fmt = argFmt
  if (fmt === undefined) {
    if (dateString.includes('-')) {
      fmt = YYYYMMDD_DASH
    } else if (dateString.includes('/')) {
      fmt = YYYYMMDD_SLASH
    } else {
      fmt = YYYYMMDD
    }
  }
  const d = $qdate.extractDate(dateString, fmt)
  console.log(`date.extractDate(${dateString}, ${fmt}) return ${d}`)
  return d
}

function format (date, fmt) {
  return $qdate.formatDate(date, fmt)
}

function today (fmt = YYYYMMDD_DASH) {
  return format(new Date(), fmt)
}

function labelDayMonthNameConcise (date) {
  return format(date, DAY_MONTH_NAME_SHORT)
}

function labelDayMonthNameVerbose (date) {
  return $qdate.formatDate(date, DAY_MONTH_NAME_LONG)
}

function addDays (date, days) {
  return $qdate.addToDate(date, { days: days })
}

function addWeeks (date, weeks) {
  return $qdate.addToDate(date, { days: weeks * 7 })
}

function addMonths (date, months) {
  return $qdate.addToDate(date, { month: months })
}

function addYears (date, years) {
  return $qdate.addToDate(date, { year: years })
}

function weekCommencing (date) {
  const dow = $qdate.getDayOfWeek(date)
  return addDays(date, -dow)
}

function startOfWeek (date) {
  return weekCommencing(date)
}

function weekFinish (date) {
  return addDays(startOfWeek(date), 6)
}

function endOfWeek (date) {
  return weekFinish(date)
}

function weekFromCurrent (offset) {
  return addWeeks(weekCommencing(new Date()), offset)
}

// Returns array of weeks in yyyymmdd format from -2 to +4 weeks away
function nearbyWeeksDates (nWeeks = DEFAULT_N_NEARBY_WEEKS) {
  const result = []
  for (let i = 0; i < nWeeks; i++) {
    result.push(weekFromCurrent(i))
  }
  return result
}

function nearbyWeeksTags (nWeeks = DEFAULT_N_NEARBY_WEEKS) {
  const result = []
  for (let i = 0; i < nWeeks; i++) {
    const tag = i === 0 ? 'This week' : (i === 1 ? 'Next week' : `+ ${i} weeks`)
    result.push(tag)
  }
  return result
}

function nearbyWeeksLabels (fmt = DEFAULT_FORMAT, nWeeks = DEFAULT_N_NEARBY_WEEKS) {
  const result = []
  nearbyWeeksDates(nWeeks).forEach((week, index) => {
    // const tag = index === 0 ? 'This week' : (index === 1 ? 'Next week' : `+ ${index} weeks`)
    // result.push(tag + NEARBY_WEEKS_SEPARATOR + format(week, fmt))
    result.push(format(week, fmt))
  })
  return result
}

function weekDates (firstWeekYYYYMMDD, nWeeks = DEFAULT_N_NEARBY_WEEKS) {
  const firstWeek = extractDate(firstWeekYYYYMMDD, YYYYMMDD)
  const result = []
  for (let i = 0; i < nWeeks; i++) {
    result.push(addWeeks(firstWeek, i))
  }
  return result
}

function weekYYYYMMDDs (firstWeekYYYYMMDD, nWeeks = DEFAULT_N_NEARBY_WEEKS) {
  return weekDates(firstWeekYYYYMMDD, nWeeks).map(d => format(d, YYYYMMDD))
}

module.exports = {
  YYYYMMDD,
  YYYYMMDD_DASH,
  YYYYMMDD_SLASH,
  DAY_MONTH_NAME_SHORT,
  DAY_MONTH_NAME_SHORT_YEAR,
  DAY_MONTH_NAME_LONG,
  DAY_MONTH_NAME_LONG_YEAR,
  DEFAULT_FORMAT,
  NEARBY_WEEKS_SEPARATOR,
  DEFAULT_N_NEARBY_WEEKS,

  extractDate,
  format,
  today,
  labelDayMonthNameConcise,
  labelDayMonthNameVerbose,

  addDays,
  addWeeks,
  addMonths,
  addYears,

  weekCommencing,
  startOfWeek,
  weekFinish,
  endOfWeek,

  nearbyWeeksDates,
  nearbyWeeksTags,
  nearbyWeeksLabels,
  weekDates,
  weekYYYYMMDDs
}