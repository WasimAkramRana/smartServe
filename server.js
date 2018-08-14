"use strict";
<<<<<<< HEAD
const express     	    = require('express');
const app           	  = express();
const bodyParser 	      = require('body-parser');
const cors        	    = require('cors');
var expressValidator    = require('express-validator');
var bunyan              = require('bunyan');
var bunyanMiddleware    = require('bunyan-middleware');
const fs                = require('fs');
var swaggerUi           = require('swagger-ui-express');
const YAML              = require('yamljs');
const swaggerDoc        = YAML.load('./swagger/swagger.yaml');
global.configs          = require('./config/configs.json');
var bunyanLogger        = bunyan.createLogger({name:global.configs.appName, streams: [{path: global.configs.logsPath}]});
=======
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
var expressValidator = require('express-validator');
var bunyan = require('bunyan');
var bunyanMiddleware = require('bunyan-middleware');
const fs = require('fs');
global.configs = require('./config/configs.json');
var bunyanLogger = bunyan.createLogger({ name: global.configs.appName, streams: [{ path: global.configs.logsPath }] });
>>>>>>> d4eb1332272c7e61b24626e192281f6a7d848d32

/**
 * This block of code is use for to configure application level middlewares
 */
app.use(bunyanMiddleware(bunyanLogger)); // Configure bunyan logger for track user API actions in log file
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
    bunyanLogger.error(err.stack);
    res.status(401).json({ error: 'Something wrong with request' });
});

/**
<<<<<<< HEAD
* These middlewares is use for define module wise rounting
*/

app.get("/",function(req,res,next){
  res.send("Server is running");
});

app.use('/user',        require('./routes/users.js')); //Call all user API routes
app.use('/restaurant',  require('./routes/restaurant.js')); //Call all user API routes
app.use('/product',     require('./routes/product.js')); //Call all user API routes

/**
* Swagger document API
*/
app.use('/swagger',swaggerUi.serve, swaggerUi.setup(swaggerDoc));

=======
 * These middlewares is use for define module wise rounting
 */
app.use('/', require('./routes/users.js')); //Call all user API routes
>>>>>>> d4eb1332272c7e61b24626e192281f6a7d848d32

/**
 * Application running on given port
 **/
app.listen(configs.appPort);
console.log('SmartServe API server is runnning at ' + configs.appPort);