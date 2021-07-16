/*
Product status:
  * finished
  * ingredient

Status properties
{
  code,
  label,
  isFinished,
  isIngredient
}
*/

const FINISHED_CODE = 'F'
const INGREDIENT_CODE = 'I'

function instantiate(code, label) {
  return {
    code: code,
    label: label,
    isFinished: code === FINISHED_CODE,
    isIngredient: code === INGREDIENT_CODE
  }
}

const finished = instantiate(FINISHED_CODE, 'Finished')
const ingredient = instantiate(INGREDIENT_CODE, 'Ingredient')
const all = [finished, ingredient]
const map = {}
all.forEach(x => map[x.code] = x)

module.exports = {
  FINISHED_CODE,
  INGREDIENT_CODE,
  finished,
  ingredient,
  all,
  map
}
