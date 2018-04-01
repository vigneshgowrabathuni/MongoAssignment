var mongoose = require('mongoose');
var schema= mongoose.Schema;
var userCredSchema = new schema({
  fName : String,
  lName : String,
  eMail:String,
  pwd: String
});

var userModel = mongoose.model('userDetail',userCredSchema,'userCredentials');
var user = {};

user.getAllUser = function(callback){
  console.log("getAllusers");
  userModel.find({},callback);
}
user.findOneUser = function(user,callback){
  userModel.findOne({eMail:user.eMail,pwd:user.pwd},callback);
}
user.addingUser = function(userObject,callback){
  console.log(userObject);
   var newUser = new userModel(userObject);
   return newUser.save(callback);
}
module.exports = user;