var express = require('express'); 
var app = express(); 
var request = require('request'); 
var bodyParser = require('body-parser'); 
var db = require('./models'); 
var session = require('express-session');
var methodOverride = require('method-override'); 