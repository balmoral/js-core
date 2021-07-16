/*
const action = require(action.js)

function measure_s(ingredient) {
  '%0.2f' % measure
}

function lead_time_s(ingredient) {
  lead_time.to_s
}

function label(ingredient) {
  const product = ingredient.product
  const label = product.code.length > product.name.size ? product.code : product.name
  label.length == 0 ? 'missing product code or name' : label
}

// caller must provide recipe which includes ingredient
function ingredientCost(recipe, ingredient) {
  if (ingredient.recipe_id !== recipe._id) throw new Error('ingredient does not belong to recipe')
  const measure_total = recipe.measure_total
  if (measure_total === 0) {
    return 0
  }
  else {
    let cost = ingredient.product.cost_per_kg
    cost *= measure / measure_total
    if (action.hasItemWeight(ingredient.recipe.product.action)) {
      cost *= owner.item_weight 
    }
    return cost
  }
}

function cost_s(ingredient) {
  '%0.4f' % cost
}
*/