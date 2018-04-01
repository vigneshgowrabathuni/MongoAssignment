var express = require('express');
var userDB = require('../public/models/userDB');
var recipeDB = require('../public/models/recipeDB');
var router = express.Router();

router.route('/addNewUser')
.post(function(req,res){
  var form = req.body;
  userDB.addingUser(form,function(err,result){
    if(err){
      res.send("sorry error found");
    }
    else{
      res.json(result);
    }
  })
})

router.route('/checkUserCredential')
.post(function(req,res){
  var user = req.body;
  userDB.findOneUser(user,function(err,result){
    if(err){
      res.send("sorry error found");
    }
    else{
      res.json(result);
    }
  })
})

router.route('/addRecipe')
.post(function(req,res){
  var recipe = req.body;
  console.log("----------------");
  console.log(recipe);
  recipeDB.addRecipeToDB(recipe,function(err,result){
    if(err){
      res.send("sorry error found");
    }
    else{
      res.json(result);
    }
  })
})

router.route('/getAllRecipes/:recipe')
.get(function(req,res){
  var rName = req.params.recipe;
  console.log("------getAllRecipes----------");
  console.log(rName);
  recipeDB.getAllRecipes(rName,function(err,result){
    if(err){
      res.send("sorry error found");
    }
    else{
      console.log(result);
      res.json(result);
    }
  })
})


router.route('/deleteRecipe/:recipe')
.delete(function(req,res){
  recipeName = req.params.recipe;
  recipeDB.deleteRecipeFromDB(recipeName,function(err,result){
    if(err){
      res.send("sorry error found");
    }
    else{
      res.json(result);
    }
  })
})

module.exports = router;
