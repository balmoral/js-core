const csvUtil = require('../util/csv')
const dateUtil = require('../util/date')

const STANDING_WEEK = 'standing' // special weeks are YYYYMMDD

const STANDING_LABEL = 'Standing'
const SPECIAL_LABEL = 'Special'
const GROUPINGS = ['Customer', 'Product']

const SHOW_ALL = 'All orders'
const SHOW_NONZERO = 'Non-zero orders'
const SHOW_SPECIAL = 'Special orders'
const SHOW_ZERO = 'Zero orders'
const SHOW_OPTIONS = [SHOW_ALL, SHOW_NONZERO, SHOW_SPECIAL, SHOW_ZERO]
const SHOW_OPTIONS_NO_SPECIAL = [SHOW_ALL, SHOW_NONZERO, SHOW_ZERO]
const PERIOD_FORMAT = dateUtil.DAY_MONTH_NAME_LONG

const ZERO_QTYS = [0, 0, 0, 0, 0, 0, 0]
const NULL_QTYS = [-1, -1, -1, -1, -1, -1, -1]

const ZERO_QTYS_CSV = '0,0,0,0,0,0,0'
const NULL_QTYS_CSV = '-1,-1,-1,-1,-1,-1,-1'

const DAY_TAGS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
const WEEK_TOT_TAG = 'tot'

const DEFAULT_N_NEARBY_WEEKS = 8

function dayIndex (dayTag) {
  const i = DAY_TAGS.indexOf(dayTag)
  if (i < 0) throw new Error(`lib.bakeworks.order: invalid day tag '${dayTag}'`)
  return i
}

function itemDebugString (item) {
  return `item = { customer: ${item.customer.name}, product: ${item.product.name}, week: ${item.week}, standing: ${JSON.stringify(item.standing)}, current: ${JSON.stringify(item.current)}`
}

// week should be 'standing' or 'YYYYMMDD'
function isWeekStanding (week) {
  return week === STANDING_WEEK
}

// week should be 'standing' or 'YYYYMMDD'
// returns ZERO_QTYS if standing, NULL_QTYS if special
function initialQtys(week) {
  return isWeekStanding(week) ? ZERO_QTYS : NULL_QTYS
}

function isItemStanding (item) {
  return isWeekStanding(item.week)
}

function isItemStandingQuantity (item, day) {
  return item.current[day] === item.standing[day]
}

function isItemSpecialQuantity (item, day) {
  return !isItemStandingQuantity(item, day)
}

function __itemTotal (qtys) {
  return DAY_TAGS.reduce((sum, day) => sum + parseInt(qtys[day]), 0)
}

function __itemSpecialDayCount (item) {
  var sum = 0
  DAY_TAGS.forEach((day) => {
    if (isItemSpecialQuantity(item, day) && parseInt(item.current[day]) > 0) {
      sum += 1
    }
  })
  return sum
}

function __setItemQuantity (qtys, day, qty) {
  qtys[day] = parseInt(qty)
  qtys.tot = __itemTotal(qtys)
}

function setItemQuantity (item, day, qty) {
  __setItemQuantity(item.current, day, qty)
  // keep standing and current identical if order is standing
  if (isItemStanding(item)) {
    __setItemQuantity(item.standing, day, qty)
  }
}

function setItemQuantityToStanding (item, day) {
  if (!isItemStanding(item)) {
    setItemQuantity(item, day, item.standing[day])
  }
}

function itemTotal (item, source = 'current') {
  return __itemTotal(item[source])
}

function itemsTotal (order) {
  return order.items.reduce((sum, item) => sum + itemTotal(item), 0)
}

function uniqueItemsCount (order) {
  return order.items.reduce((count, item) => count + (itemTotal(item) === 0 ? 0 : 1), 0)
}

function specialItemsCount (order) {
  return order.items.reduce((count, item) => count + __itemSpecialDayCount(item), 0)
}

function nearbyWeeksAsPeriods (fmt = PERIOD_FORMAT, nWeeks = DEFAULT_N_NEARBY_WEEKS) {
  const dates = dateUtil.nearbyWeeksDates(nWeeks)
  const tags = dateUtil.nearbyWeeksTags(nWeeks)
  const labels = dateUtil.nearbyWeeksLabels(fmt, nWeeks)
  const result = []
  for (let i = 0; i < nWeeks; i++) {
    result.push({
      isStanding: false,
      index: i,
      start: dates[i],
      finish: dateUtil.addDays(dates[i], 6),
      tag: tags[i],
      label: labels[i]
    })
  }
  // console.log(`$order.nearbyWeeksAsPeriods(fmt=${fmt}, nWeeks=${nWeeks}) return ${result}`)
  return result
}

function periods (dateFormat = PERIOD_FORMAT) {
  const standing = { isStanding: true, index: null, start: null, finish: null, tag: STANDING_LABEL, label: STANDING_LABEL }
  return [standing].concat(nearbyWeeksAsPeriods(dateFormat))
}

function periodAsWeek (period) {
  return period.isStanding ? 'standing' : dateUtil.format(period.start, dateUtil.YYYYMMDD)
}

function isMatchingItem (a, b) {
  return a.customer._id === b.customer._id && a.product._id === b.product._id
}

function findMatchingItem (item, items) {
  return items.find(candidate => isMatchingItem(candidate, item))
}

function removeMatchingItem (item, items) {
  const fn = `api.order.removeMatchingItem(customer._id=${item.customer._id}, product._id=${item.product._id})`
  console.log(fn)
  const i = items.findIndex(candidate => isMatchingItem(candidate, item))
  console.log(`${fn} : i=${i} items.length=${items.length}`)
  if (i !== -1) {
    items.splice(i, 1)
    const j = items.findIndex(candidate => isMatchingItem(candidate, item))
    console.log(`${fn} : i=${i} items.length=${items.length} j=${j}`)
  }
  return items
}

function matchingSpecial (standingOrder, specialOrders) {
  return specialOrders.find(candidate => isMatchingItem(standingOrder, candidate))
}

// Map array quantities to object with DAY_TAGS as keys.
// Includes weekly total keyed with WEEK_TOT_TAG.
function mapQtysToDays (quantities) {
  const result = { }
  var i = -1
  DAY_TAGS.forEach(tag => {
    result[tag] = quantities[i += 1]
  })
  result[WEEK_TOT_TAG] = quantities.reduce((sum, v) => sum + parseInt(v), 0)
  return result
}

// Takes standing and special quantities and returns object
// with standing and current quantities (resolving special/standing).
// Given quantities may be CSV strings or 7-element arrays mapping
// to each day of the week.
function mapQtysToArrays (standingQtys, specialQtys) {
  const resolve = (qtys, dflt) => {
    return qtys === undefined ? dflt : ((typeof qtys === 'string') ? csvUtil.parseIntArray(qtys) : qtys)
  }
  const standing = resolve(standingQtys, ZERO_QTYS)
  const special = resolve(specialQtys, NULL_QTYS)
  const current = standing.slice(0) // clone
  for (let i = 0; i < 7; i++) {
    const q = special[i]
    current[i] = q < 0 ? standing[i] : q
  }
  return {
    standing: standing,
    current: current
  }
}

function resolveToWeek(weekOrPeriod) {
  return typeof weekOrPeriod === 'string' ? weekOrPeriod : periodAsWeek(weekOrPeriod)
}

// standingQtys and specialQtys are optional and will appropriately default.
// weekOrPeriod should be 'standing' or 'YYYYMMDD', or a period object
function newUnresolvedItem (customerId, productId, weekOrPeriod, standingQtys, specialQtys) {
  const week = resolveToWeek(weekOrPeriod)
  return {
    customerId,
    productId,
    week,
    ...mapQtysToArrays(standingQtys, specialQtys)
  }
}

// weekOrPeriod should be 'standing' or 'YYYYMMDD', or a period object
// standing and current quantities in item will be initialised to zero
function newResolvedItem (customer, product, weekOrPeriod) {
  const week = resolveToWeek(weekOrPeriod)
  return {
    customer,
    product,
    week,
    standing: mapQtysToDays(ZERO_QTYS),
    current: mapQtysToDays(ZERO_QTYS),
  }
}

// item as returned by newUnresolvedItem
// customers and products to resolve customerId and productId
// returns item with customer and product resolved
function resolveItem (item, customers, products) {
  return {
    customer: customers.find(e => e._id === item.customerId),
    product: products.find(e => e._id === item.productId),
    week: item.week,
    standing: mapQtysToDays(item.standing),
    current: mapQtysToDays(item.current)
  }
}

// standing and current are objects of form { sun: 0, mon: 1, ... }
// returns object of form{ standing: [0,0,0,0,0,0,0], special: [0,0,0,0,0,0,0]}
function quantitiesByDayToArrays (standingByDay, currentByDay) {
  const standing = []
  const special = []
  DAY_TAGS.forEach(day => {
    const standingQty = standingByDay[day]
    const specialQty = currentByDay[day]
    standing.push(standingQty)
    special.push(specialQty < 0 || specialQty === standingQty ? -1 : specialQty)
  })
  return {
    standing: standing,
    special: special
  }
}

// returns object of form{ standing: [0,0,0,0,0,0,0], special: [0,0,0,0,0,0,0]}
function itemQuantitiesToArrays (item) {
  return quantitiesByDayToArrays(item.standing, item.current)
}

// deprecated: legacy only
function quantitiesByDayToCSVs (standingByDay, currentByDay) {
  const a = quantitiesByDayToArrays(standingByDay, currentByDay)
  return {
    standing: join(a.standing, ','),
    special: join(a.special, ',')
  }
}

// deprecated: legacy only
function itemQuantitiesToCSVs (item) {
  return quantitiesByDayToCSVs(item.standing, item.current)
}

module.exports = {

  STANDING_WEEK,
  STANDING_LABEL,
  SPECIAL_LABEL,
  GROUPINGS,
  SHOW_ALL,
  SHOW_NONZERO,
  SHOW_SPECIAL,
  SHOW_ZERO,
  SHOW_OPTIONS,
  SHOW_OPTIONS_NO_SPECIAL,
  PERIOD_FORMAT,
  ZERO_QTYS,
  NULL_QTYS,
  ZERO_QTYS_CSV,
  NULL_QTYS_CSV,
  DAY_TAGS,
  WEEK_TOT_TAG,

  itemDebugString,
  isWeekStanding,
  initialQtys,
  isItemStanding,
  isItemStandingQuantity,
  isItemSpecialQuantity,
  setItemQuantity,
  setItemQuantityToStanding,
  itemTotal,
  itemsTotal,
  uniqueItemsCount,
  specialItemsCount,
  resolveToWeek,
  newUnresolvedItem,
  newResolvedItem,
  resolveItem,

  dayIndex,
  nearbyWeeksAsPeriods,
  periods,
  periodAsWeek,
  isMatchingItem,
  findMatchingItem,
  removeMatchingItem,
  matchingSpecial,

  mapQtysToDays,
  quantitiesByDayToArrays,
  itemQuantitiesToArrays,
  quantitiesByDayToCSVs,
  itemQuantitiesToCSVs
}