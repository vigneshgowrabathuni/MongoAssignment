 var mongoose = require('mongoose');
var schema= mongoose.Schema;
var RecipeDetailsSchema = new schema({
  rName : String,
  rImage: String,
  rIngredients : String,
  rCalories:String
});

var recipeDetailsModel = mongoose.model('recipeDetails',RecipeDetailsSchema);
var recipe = {};
console.log("inside the schema db");
recipe.addRecipeToDB = function(input,callback){
  console.log("0000000000000000");
  console.log(input);
  var newRecipe  = new recipeDetailsModel(input);
  return newRecipe.save(callback);
}

recipe.getAllRecipes = function(recipeName,callback){
  return recipeDetailsModel.find({rName:recipeName},callback);
}
recipe.deleteRecipeFromDB = function(recipeName,callback) {
  return recipeDetailsModel.findOneAndRemove({rName:recipeName},callback);
}
module.exports = recipe;
