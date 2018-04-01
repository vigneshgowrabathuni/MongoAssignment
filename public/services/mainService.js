angular.module('myApp')
.factory('mainService',function($http){
  return{
    registerUser : function(formData){
      return $http.post('/UserRoute/addNewUser',formData);
    },
    checkCredentials: function(loginForm){
      console.log("$$$$$$$$$");
      console.log(loginForm);
      return $http.post('/UserRoute/checkUserCredential',loginForm);
    },
    addRecipeData: function(data){
      return $http.post('/UserRoute/addRecipe',data);
    },
    getRecipeData: function(rName){
      return $http.get('/UserRoute/getAllRecipes/'+rName);
    },
    deleteRecipeData: function(rName){
      return $http.delete('/UserRoute/deleteRecipe/'+rName);
    }
  }
})
