/*'use strict';
angular.module('appRoute')
.controller('loginController',function($scope,$timeout,mainService,authService,$q,$state,$stateParams){
  $scope.logValBD = false;
  $scope.logValLO = false;

  $scope.ShowBookSeat = true;
  $scope.HideBookSeat = false;

  $scope.logValBD = $stateParams.param1;
  $scope.logValLO = $stateParams.param2;
  $scope.ShowBookSeat = $stateParams.showSeat;
  $scope.HideBookSeat = $stateParams.HideBookSeat;
  var userObj = authService.getUser();
  if(userObj != undefined){
    var userName = userObj.userName;
    $scope.currentUser = userName.substring(0,1).toUpperCase()+userName.substring(1,userName.length);
    $scope.User = userObj.eMail;
  }
  this.onlyWeekendsPredicate = function(date) {
    var myDate = new Date();
    var day = myDate.getDate();
    var month = myDate.getMonth();
    var year = myDate.getFullYear();
    if((date.getMonth() < month && date.getFullYear() <= year) ||  date.getFullYear() < year){
      return 0;
    }else if(date.getDate() < day && date.getMonth() == month ){
      return 0;
    }else{
      return 1;
    }
  };
  $scope.formdata = {};
  $scope.bookingDetails = {};
  $scope.userRole = "";
  //---------------log in function------------------------
  $scope.login = function(form1){
    mainService.set(form1.eMail);
    authService.signIn(form1).then(function(user){
      if(user.userType == 'admin'){
        $scope.logValBD = false;
              $scope.logValLO = true;
              $state.go("adminHomePage");
      }
      else{
              $scope.logValBD = true;
              $scope.logValLO = true;
              $state.go("bookSeat");
      }
        // $state.go(user.userType);
    },function(err) {
      $scope.errorMessage = err.error;
    });
  }


  //---------------------Rgister a New User-------------------------
  $scope.registerNewUser = function(form){
    $scope.formdata.userName = form.userName;
    $scope.formdata.eMail = form.eMail;
    $scope.formdata.password = form.password;
    $scope.formdata.userType = "user";
    mainService.checkCredentials().success(function(data){
      var flag1 = 0;
      for (var i = 0; i < data.length; i++) {
        if(data[i].eMail == form.eMail){
          flag1 = 1;
        }
      }
      if(flag1 == 1){
        form.userName = "";
        form.eMail = "";
        form.password = "";
        form.retypPassword = "";
        $scope.errorMessage  = "User already exist with Username";
      }
      else if(form.password != form.retypPassword){
        form.password = "";
        form.retypPassword = "";
        $scope.errorMessage  = "Password Mismatch";
      }
      else{
        $scope.errorMessage  = "";
        form.userName = "";
        form.eMail = "";
        form.password = "";
        form.retypPassword = "";
        mainService.registerUser($scope.formdata).success(function(data){
          swal("Good job!", "You are Successfully registered.", "success");
          $state.go("login");
        })
      }
    })
  }

  $scope.currentUserName = "";
  mainService.checkCredentials().success(function(response){
    for (var i = 0; i < response.length; i++) {
      if(response[i].eMail == $scope.currentUser){
        $scope.currentUserName = response[i].userName.substring(0,1).toUpperCase() + response[i].userName.substring(1,response[i].userName.length);
      }

    }
  })
  //------------------Booking Details----------------------
  $scope.bookTheSeat =  function(bookingData,type){
    if(((type == "Room Booking") && (bookingData.Area == undefined ||bookingData.Tower== undefined || bookingData.Floor == undefined || bookingData.Wing == undefined|| bookingData.Room == undefined))
      || ((type == "Desk Booking") && (bookingData.Area== undefined ||bookingData.Tower== undefined || bookingData.Floor == undefined || bookingData.Wing == undefined || bookingData.Zone == undefined) ) ){
            swal("Fields are Empty", "Please select all the fields", "warning");
    }
    else{

      if(type == "Room Booking"){
        $scope.bookingDetails.BookingType = type;
        $scope.bookingDetails.Zone = "";
        $scope.bookingDetails.Room = bookingData.Room.name;
        $scope.bookingDetails.TypeOfSeater = bookingData.RoomCapacity.name;
      }
      else{
        $scope.bookingDetails.BookingType = type;
        $scope.bookingDetails.Zone = bookingData.Zone.name;
        $scope.bookingDetails.Room = "";
        $scope.bookingDetails.TypeOfSeater = "";
      }
      function parseDate(str) {
        var date = new Date(str),
        mnth = ("0" + (date.getMonth()+1)).slice(-2),
        day  = ("0" + date.getDate()).slice(-2);
        return [ date.getFullYear(), mnth, day ].join("-");
      }
      $scope.bookingDetails.BookingOwner = $scope.User;
      $scope.bookingDetails.Area = bookingData.Area.name;
      $scope.bookingDetails.Tower = bookingData.Tower.name;
      $scope.bookingDetails.Floor = bookingData.Floor.name;
      $scope.bookingDetails.Wing = bookingData.Wing.name;
      $scope.bookingDetails.BookingDate = parseDate(bookingData.BookingDate);
      $scope.bookingDetails.StartTime = bookingData.StartTime.name;
      $scope.bookingDetails.EndTime = bookingData.EndTime.name;
      //-----------------splitting time-------------
      var userStartTime = $scope.bookingDetails.StartTime.split(":");
      var userStartTimeHour = parseInt(userStartTime[0]);
      var userStartTimeMinute = parseInt(userStartTime[1]);

      var userEndTime = $scope.bookingDetails.EndTime.split(":");
      var userEndTimeHour = parseInt(userEndTime[0]);
      var userEndTimeMinute = parseInt(userEndTime[1]);
      var checkBooking = 0;

      if((userStartTimeHour > userEndTimeHour) || (userStartTimeHour == userEndTimeHour && userStartTimeMinute >=userEndTimeMinute)){
        swal("Booking status!", "Start Time should be less than the End Time", "warning");
      }
      else{
        mainService.getAllTheBookings().success(function(response){

          $scope.bookingOfZoneArray = [];
          $scope.seatNames = [];
          for (var i = 0; i < response.length; i++) {
            var responseStartTime = response[i].StartTime.split(":");
            var responseStartTimeHour = parseInt(responseStartTime[0]);
            var responseStartTimeMinute = parseInt(responseStartTime[1]);
            var responseEndTime = response[i].EndTime.split(":");
            var responseEndTimeHour = responseEndTime[0];
            var responseEndTimeMinute = responseEndTime[1];
            // var checkBooking = 0;
            var checkRoomBookingSameUser = 0;
            var checkRoomBookingDiffUser = 0;
            var checkZoneBookingSameUser = 0;
            var checkZoneBookingDiffUser = 0;
            //--------------------code for stoppping multiple bookings by same user-----------------------

            //----------taking room bookings in response and checking if user already booked for same time slot, if yes setting checkRoomBookingSameUser=1 and coming out of loop,,, else checking for clash of time slot with other bookings
            if($scope.bookingDetails.BookingType == 'Room Booking' && response[i].Room != "" ){
              if(response[i].BookingDate == $scope.bookingDetails.BookingDate &&  response[i].BookingOwner == $scope.bookingDetails.BookingOwner){
                if(
                  (  (  ( userStartTimeHour == responseStartTimeHour && userStartTimeMinute >= responseStartTimeMinute) ||(userStartTimeHour > responseStartTimeHour)  ) &&  (  ( userStartTimeHour == responseEndTimeHour && userStartTimeMinute < responseEndTimeMinute) ||(userStartTimeHour < responseEndTimeHour)  ) ) ||
                  (  (  ( userEndTimeHour == responseStartTimeHour && userEndTimeMinute > responseStartTimeMinute) ||(userEndTimeHour > responseStartTimeHour)  )  &&   (  ( userEndTimeHour == responseEndTimeHour && userEndTimeMinute <= responseEndTimeMinute) ||(userEndTimeHour < responseEndTimeHour)  ) )||
                  (  (  (  userStartTimeHour == responseStartTimeHour && userStartTimeMinute < responseStartTimeMinute) || userStartTimeHour < responseStartTimeHour )  &&    (  (userEndTimeHour == responseEndTimeHour && userEndTimeMinute > responseEndTimeMinute) || userEndTimeHour > responseEndTimeHour )  ) ){
                    checkRoomBookingSameUser = 1;
                    break;
                  }
                }
                else if(response[i].BookingDate == $scope.bookingDetails.BookingDate &&  response[i].BookingOwner != $scope.bookingDetails.BookingOwner){
                  if(
                    (  (  ( userStartTimeHour == responseStartTimeHour && userStartTimeMinute >= responseStartTimeMinute) ||(userStartTimeHour > responseStartTimeHour)  ) &&  (  ( userStartTimeHour == responseEndTimeHour && userStartTimeMinute < responseEndTimeMinute) ||(userStartTimeHour < responseEndTimeHour)  ) ) ||
                    (  (  ( userEndTimeHour == responseStartTimeHour && userEndTimeMinute > responseStartTimeMinute) ||(userEndTimeHour > responseStartTimeHour)  )  &&   (  ( userEndTimeHour == responseEndTimeHour && userEndTimeMinute <= responseEndTimeMinute) ||(userEndTimeHour < responseEndTimeHour)  ) )||
                    (  (  (  userStartTimeHour == responseStartTimeHour && userStartTimeMinute < responseStartTimeMinute) || userStartTimeHour < responseStartTimeHour )  &&    (  (userEndTimeHour == responseEndTimeHour && userEndTimeMinute > responseEndTimeMinute) || userEndTimeHour > responseEndTimeHour )  ) ){

                      if( (response[i].Area == $scope.bookingDetails.Area) && (response[i].Tower == $scope.bookingDetails.Tower) && (response[i].Floor == $scope.bookingDetails.Floor) && (response[i].Wing == $scope.bookingDetails.Wing && response[i].Room == $scope.bookingDetails.Room && response[i].TypeOfSeater == $scope.bookingDetails.TypeOfSeater )){
                        checkRoomBookingDiffUser = 1;
                        break;

                      }

                    }
                  }
                }
                //------taking desk booking in response and checking if the user already booked other seat at this slot,
                //if yes setting checkZoneBookingSameUser=1 and coming out of loop.
                // Else taking all the bookings on the same day  and taking in $scope.bookingOfZoneArray array for further checking of seats
                else if($scope.bookingDetails.BookingType == 'Desk Booking' && response[i].Zone != "" ){
                  if(response[i].BookingDate == $scope.bookingDetails.BookingDate &&  response[i].BookingOwner == $scope.bookingDetails.BookingOwner){
                    if(
                      (  (  ( userStartTimeHour == responseStartTimeHour && userStartTimeMinute >= responseStartTimeMinute) ||(userStartTimeHour > responseStartTimeHour)  ) &&  (  ( userStartTimeHour == responseEndTimeHour && userStartTimeMinute < responseEndTimeMinute) ||(userStartTimeHour < responseEndTimeHour)  ) ) ||
                      (  (  ( userEndTimeHour == responseStartTimeHour && userEndTimeMinute > responseStartTimeMinute) ||(userEndTimeHour > responseStartTimeHour)  )  &&   (  ( userEndTimeHour == responseEndTimeHour && userEndTimeMinute <= responseEndTimeMinute) ||(userEndTimeHour < responseEndTimeHour)  ) )||
                      (  (  (  userStartTimeHour == responseStartTimeHour && userStartTimeMinute < responseStartTimeMinute) || userStartTimeHour < responseStartTimeHour )  &&    (  (userEndTimeHour == responseEndTimeHour && userEndTimeMinute > responseEndTimeMinute) || userEndTimeHour > responseEndTimeHour )  ) ){
                        checkZoneBookingSameUser = 1;
                        break;
                      }
                    }
                    else if(response[i].BookingDate == $scope.bookingDetails.BookingDate &&  response[i].BookingOwner != $scope.bookingDetails.BookingOwner){
                      if( (response[i].Area == $scope.bookingDetails.Area) && (response[i].Tower == $scope.bookingDetails.Tower) && (response[i].Floor == $scope.bookingDetails.Floor) && (response[i].Wing == $scope.bookingDetails.Wing)){
                        $scope.bookingOfZoneArray.push(response[i]);
                      }
                    }
                  }
                }

                // checking for room booking----
                if($scope.bookingDetails.Room){
                  if(checkRoomBookingSameUser == 1){
                    swal("Booking status!", "Sorry you have already booked another room for this time slot", "error");
                  }
                  else if(checkRoomBookingDiffUser ==1){
                    swal("Booking status!", "Sorry Room is not available for this time slot ", "error");
                  }
                  else{
                    mainService.addBookingDetails($scope.bookingDetails).success(function(response){

                      swal("Booking status!", "Successfully Booked Your Seat", "success");
                    })
                  }
                }
                //----checking for desk booking
                else{
                  if(checkZoneBookingSameUser == 1){
                    swal("Booking status!", "Sorry you have already booked the seat for this time slot", "error");
                  }
                  else{
                    var seat = 0;
                    var userSeat = "";
                    var arr = $scope.seatNames;
                    var arrLast = arr[arr.length-1];
                    //
                    $scope.seatNames = $scope.seatNames.sort();
                    if($scope.bookingOfZoneArray.length == 0){
                      userSeat =  $scope.bookingDetails.Zone.charAt(0)+"-00";
                    }
                    else {
                      //-----logic for checking for availabilty of seat for the user's time selected
                      var seatsArr = [];
                      var arrayOfSingleSeat = [];
                      for (var l = 0; l < 5; l++) {
                        arr[l] = $scope.bookingDetails.Zone.charAt(0)+"-"+"0"+l;
                      }
                      var checkForSeat = 0;
                      for (var i = 0; i < 5; i++) {
                        for (var j = 0; j < $scope.bookingOfZoneArray.length; j++) {
                          if(arr[i] ==  $scope.bookingOfZoneArray[j].SeatNumber){
                            arrayOfSingleSeat.push($scope.bookingOfZoneArray[j]);
                          }
                        }

                        for (var k = 0; k < arrayOfSingleSeat.length; k++) {
                          // checkForSeat = 0;
                          var responseStartTime = arrayOfSingleSeat[k].StartTime.split(":");
                          var responseStartTimeHour = parseInt(responseStartTime[0]);
                          var responseStartTimeMinute = parseInt(responseStartTime[1]);
                          var responseEndTime = arrayOfSingleSeat[k].EndTime.split(":");
                          var responseEndTimeHour = responseEndTime[0];
                          var responseEndTimeMinute = responseEndTime[1];

                          if(  ( userStartTimeHour == responseStartTimeHour && userStartTimeMinute == responseStartTimeMinute)  || ( userEndTimeHour == responseEndTimeHour && userEndTimeMinute == responseEndTimeMinute) ||
                          (  (  ( userStartTimeHour == responseStartTimeHour && userStartTimeMinute >= responseStartTimeMinute) ||(userStartTimeHour > responseStartTimeHour)  ) &&  (  ( userStartTimeHour == responseEndTimeHour && userStartTimeMinute < responseEndTimeMinute) ||(userStartTimeHour < responseEndTimeHour)  ) ) ||
                          (  (  ( userEndTimeHour == responseStartTimeHour && userEndTimeMinute > responseStartTimeMinute) ||(userEndTimeHour > responseStartTimeHour)  )  &&   (  ( userEndTimeHour == responseEndTimeHour && userEndTimeMinute <= responseEndTimeMinute) ||(userEndTimeHour < responseEndTimeHour)  ) )||
                          (  (  (  userStartTimeHour == responseStartTimeHour && userStartTimeMinute < responseStartTimeMinute) || userStartTimeHour < responseStartTimeHour )  &&    (  (userEndTimeHour == responseEndTimeHour && userEndTimeMinute > responseEndTimeMinute) || userEndTimeHour > responseEndTimeHour )  ) ){
                            checkForSeat = 1;

                          }
                        }
                        if(checkForSeat == 0){
                          userSeat = arr[i];
                          break;
                        }
                        else{
                          checkForSeat = 0;
                          arrayOfSingleSeat = [];
                        }
                      }
                    }
                    //-------------set the seat Number for this user---------------

                    if(userSeat != ""){
                      //-----if seat is available-----------------
                      $scope.bookingDetails.SeatNumber = userSeat;
                      mainService.addBookingDetails($scope.bookingDetails).success(function(response){
                        swal("Booking status!", "Successfully Booked Your Seat", "success");
                      })
                    }
                    else{
                      //-----------------seat is not available-------------
                      swal("Booking status!", "Sorry !..This slot is already booked.", "warning");

                    }
                  }
                }
              })
            }
    }

        }

        $scope.currentUserBookings = [];
        $scope.showBookingDetails = function(){
          $scope.logValBD = false;
          $scope.logValLO = true;
          $state.go("bookingDetails",{param1:$scope.logValBD,param2:$scope.logValLO});
        }



        
*/