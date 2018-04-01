'use strict';
angular.module('myApp')
.controller('appController',function($scope,$location,$http,mainService){
  $scope.errorMessage = "";
  $scope.kgraphRecords = [];
  document.getElementsByClassName('navStyle')[0].style.display="none";
  $scope.homePage = function(){
    if(localStorage.getItem('myVal') == true){
      $location.path("/homepage");
    }
  }
  $scope.aboutPage = function(){
    $location.path("/about");
  }
  $scope.contactPage = function(){
    $location.path("/contact");
  }
  $scope.registerFn = function(){
    $location.path("/register");
  }
  $scope.logoutFn = function(){
    localStorage.setItem('myVal',false);
    $location.path("/login");
  }

  $scope.onFocusFn = function(){
    $scope.errorMessage = "";
  }
  $scope.formdata = {};
  $scope.registerUser = function(regForm){
    console.log(regForm);
    $scope.formdata.fName = regForm.fName;
    $scope.formdata.lName = regForm.lName;
    $scope.formdata.eMail = regForm.eMail;
    $scope.formdata.pwd = regForm.pwd;

    mainService.checkCredentials().success(function(data){
      console.log("hello"+data);
      var flag1 = 0;
      for (var i = 0; i < data.length; i++) {
        if(data[i].eMail == regForm.eMail){
          flag1 = 1;
        }
      }
      if(flag1 == 1){
        regForm.fName = "";
        regForm.lName = "";
        regForm.eMail = "";
        regForm.pwd = "";
        regForm.cPwd = "";
        console.log("exist");
        $scope.errorMessage  = "User already exist with Username";
      }
      else if(regForm.pwd != regForm.cPwd){
        regForm.pwd = "";
        regForm.cPwd = "";
        $scope.errorMessage  = "Password Mismatch";
      }
      else{
        $scope.errorMessage  = "";
        regForm.fName = "";
        regForm.lName = "";
        regForm.eMail = "";
        regForm.pwd = "";
        regForm.cPwd = "";
        mainService.registerUser($scope.formdata).success(function(data){
          swal({
             title: "Good job!",
             text: "Registration Successful.",
             icon: "success",
             button: "okay",
           });
          $location.path("/login");
        });
      }
    })
  }

  $scope.login = function(loginForm){
    localStorage.setItem('myVal',true);
    console.log(loginForm);
    
    if(loginForm == undefined){
      $scope.errorMessage = "Inavlid Email ID or Password";
    }else{
      mainService.checkCredentials(loginForm).success(function(data){
        console.log(data);
        if(loginForm.eMail == data.eMail && loginForm.pwd == data.pwd){
          document.getElementsByClassName('navStyle')[0].style.display="block";
          $location.path("/homepage");
        }else{
          $scope.errorMessage = "Inavlid Email ID or Password";
        }
      });
    }
  }

  $scope.onGoogleLogin = function(){
    var params = {
      'clientid': '743992359852-rcf59v468vts4ffji64ckvljhfr5npur.apps.googleusercontent.com',
      'cookiepolicy':'single_host_origin',
      'callback': function(result){
        if(result['status']['signed_in']){
          $scope.$apply(function(){
            document.getElementsByClassName('navStyle')[0].style.display="block";
            $location.path("/homepage");
          });
        }
      },
      'approvalprompt': 'force',
      'scope': 'https://www.googleapis.com/auth/gmail.readonly'
    };
    gapi.auth.signIn(params);
  }

  $scope.onFacebookLogin = function(){
    FB.login(function(response){
      if(response.authResponse){
        FB.api('/me', 'GET', {fields: 'email, first_name, name, id, picture'}, function(response){
          $scope.$apply(function(){
            document.getElementsByClassName('navStyle')[0].style.display="block";
            $location.path("/homepage");
          });
        });
      }else{

      }
    }, {
      scope: 'email, user_likes',
      return_scopes: true
    });
  }

$scope.recipeAdd = function(recipeName){
  if(recipeName == undefined){
    alert('Please enter valid recipe Name');
  }
  else{
    $http.get("https://api.edamam.com/search?q=" + recipeName + "&app_id=803bd740" +
    "&app_key=f800e75c30292a82e7b45e42882bf0d8&from=0&to=1")
    .then(function(res) {
      recipeDataToDB(res.data.hits);
    }
  )
}
}

function recipeDataToDB(data){
console.log(data);
for(var i=0;i<data.length;i++){
  console.log(data[i].recipe.source);
  var rData = {};
  rData.rName = data[i].recipe.label;
  rData.rImage = data[i].recipe.image;
  rData.rIngredients = data[i].recipe.ingredients[0].text;
  rData.rCalories = data[i].recipe.calories;
  mainService.addRecipeData(rData).success(function(data){
    swal({
      title: "Added",
      text: "Recipe Details Added Successfully.",
      icon: "success",
      button: "okay",
    });
  });
}

}

$scope.recipeData = {};
$scope.viewContent = false;
$scope.recipeSearch = function(recipeName){
  if(recipeName == undefined){
    alert('Please enter valid recipe Name');
  }
  else{
      mainService.getRecipeData(recipeName).success(function(data){
        console.log(data);
        if(data.length == 0){
          swal({
            title: "Not Found",
            text: "Your Recipe is not found.",
            icon: "warning",
            button: "okay",
          });
        }else{
          $scope.viewContent = true;
          $scope.recipeData = data;
        }
      });
    }
  }

  $scope.recipeDelete = function(recipeName){
    if(recipeName == undefined){
      alert('Please enter valid recipe Name');
    }
    else{
      mainService.deleteRecipeData(recipeName).success(function(data){
        console.log(data);
        if(data == null){
          swal({
            title: "Not Found",
            text: "Your Recipe is not found.",
            icon: "warning",
            button: "okay",
          });
        }else if(data.length == 0){
          swal({
            title: "Not Found",
            text: "Your Recipe is not found.",
            icon: "warning",
            button: "okay",
          });
        }else{
        swal({
          title: "Deleted",
          text: "Recipe Details Deleted Successfully.",
          icon: "success",
          button: "okay",
        });
      }
      });
    }
  }  
})
