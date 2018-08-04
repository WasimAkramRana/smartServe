"use strict";
const express     	    = require('express');
const app           	  = express();
const bodyParser 	      = require('body-parser');
const cors        	    = require('cors');
var expressValidator    = require('express-validator');
var bunyan              = require('bunyan');
var bunyanMiddleware    = require('bunyan-middleware');
const fs                = require('fs');
global.configs          = require('./config/configs.json');
var bunyanLogger        = bunyan.createLogger({name:global.configs.appName, streams: [{path: global.configs.logsPath}]});

/**
* This block of code is use for to configure application level middlewares
*/
app.use(bunyanMiddleware(bunyanLogger)) // Configure bunyan logger for track user API actions in log file
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressValidator([]));
app.use(cors());
app.use(express.static(__dirname + 'public')); //setup static public directory
app.set('views', __dirname + '/public');


/**
* This middleware is use for to enable cores for all incomming API calls
*/
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/**
* This middleware is use for to define the error
*/
app.use(function(err, req, res, next) {
  logger.error(err.stack);
  res.status(401).json({error: 'Something wrong with request'});
});

/**
* These middlewares is use for define module wise rounting
*/
app.use('/',    require('./routes/users.js')); //Call all user API routes

/**
* Application running on given port
**/
app.listen(configs.appPort);
logger.info('SmartServe API server is runnning at ' + configs.appPort);
