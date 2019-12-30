var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var UserRoute = require('./routes/userRouter');
// Mongo DB Url
var url = 'mongodb://vignesh:welcome123@ds115472.mlab.com:15472/mydb';

mongoose.connect(url,function(err,db){
  console.log('connected');
});
var app = express();
var staticPath = path.join(__dirname, '/');
app.use(express.static(staticPath));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'routes')));
app.use(express.static(path.join(__dirname, 'node_modules')));

app.use('/UserRoute',UserRoute);

function onLoadFn(){
  gapi.client.setApiKey('AIzaSyCUCNl4JfN_WLaGY3fFXQDvG08a8vPFyx4');
  gapi.client.load('plus', 'v1', function(){});
}
app.listen(3000, function() {
  console.log('Listening at http://localhost:3000')
});
