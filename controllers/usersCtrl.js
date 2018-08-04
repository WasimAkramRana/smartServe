var crypto          = require('crypto');
var async           = require('async');
var userModel      = require('../models/usersModel.js');
var globalServices  = require('../services/globalService');
var usersModel       = new userModel(); 

/**
* This function is use for user registration process
*/
module.exports.signup = function(req, res) {
  let validatorResponse = globalServices.validateParams('signup', req.body, req, res);
  if(validatorResponse) {
    async.series([
      function(next) {
        usersModel.verifyDuplicateUser(validatorResponse.phone, req, res, next); //Call verifyDuplicateUser userValidationModel method to varify duplicate user for signup process
      },
      function(next) {
        usersModel.saveUserDetails(validatorResponse, req, res, next);    //Call saveUserDetails userValidationModel method to signup user details in db
      }
    ],
    function(err, results) {
      res.status(200).json({status : 'success', message : 'Congratulations! You have been successfully registered'}); //Send API request response
    });
  }
};

/**
* This function is use for user login module
*/
module.exports.login = function(req, res) {
  let validatorResponse = globalServices.validateParams('login', req.body, req, res);
  if(validatorResponse) {
    async.waterfall([
      function(next) {
        usersModel.getUserDetails(validatorResponse.phone, res, next); //Get login user details
      },
      function(userDetails, next) {
      //  req.userDetails = userDetails;
        validatePassword(req.body.password, userDetails, req, res, next); //Validate login user password
      },
      function(next) {
        let token = globalServices.generateJwt(req, res); //Call generate access-token method of global service
        res.status(200).json({status : 'success', 'access-token' : token}); //Send access token to the user
      }
    ],
    function(err, result) {
      logger.error(err);
    })
  }
};

/**
* This function is use for validate user password
*/
function validatePassword(password, userDetails, req, res, next) {
  let password     = crypto.pbkdf2Sync(password, userDetails.salt, 1000, 32, 'sha512').toString('hex');
  if(userDetails.password === password) {
    next();
  } else {
    res.status(409).json({status : 'error', message : 'User ID or Password is invalid. Please enter correct credentials to proceed further.'});
  }
}
