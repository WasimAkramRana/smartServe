const jwt             = require('jsonwebtoken');
var paramsValidator   = require('../config/params');
var yaml              = require('js-yaml');
var fs                = require('fs');
var validationPattern = yaml.safeLoad(fs.readFileSync('./config/validationPattern.yml'));

/**
* This function is usae for to authenticate api end points and validate access token for resource access
*/
module.exports.validateAccessToken = function(req, res, next) {
	let accessToken = req.body.token || req.headers['x-access-token'];
  if(accessToken) {
    const token     = accessToken.split('~')[1];
    req.currentUser = {};
		jwt.verify(token, configs.secretKey, function(err, decoded) {
      if(decoded) {
        req.currentUser.phone = decoded.phone;
				next();
			} else {
				return res.status(401).json({status : 'error', message : 'Invalid token'});
			}
		});
	} else {
		return res.status(401).send({status : 'error', message : 'Missing token'});
	}
};

/**
* This function is use for to generate access token
*/
module.exports.generateJwt = function(req, res) {
  return 'Bearer~' + jwt.sign({
		phone     : req.userDetails.userDetails,
		firstName : req.userDetails.firstName,
    lastName  : req.userDetails.lastName,
    exp       : Date.now() + 1 * 1 * 60 * 60 * 1000
  }, configs.secretKey);
}

/**
* This function is used for validate all requested fields
**/
 module.exports.validateParams = function(action, params, req, res) {
   var permitted_data = [];
   var selectedData   = {};

   if(action in paramsValidator.params) {
     for(let i=0; i<paramsValidator.params[action].fields.length; i++) {
       permitted_data.push(paramsValidator.params[action].fields[i].name);
     }
   }

   for(let i=0; i<permitted_data.length; i++) {
     if(permitted_data[i] in params) {
        req.check(permitted_data[i], 'Validation Failed').matches(eval(validationPattern.fields[paramsValidator.params[action].fields[i].type].pattern));
         var errors =  req.validationErrors();
         if (errors) {
           res.status(400).json({status : 'error', message : errors[0].msg, param:errors[0].param, value : errors[0].value});
           return;
         } else {
           selectedData[permitted_data[i]] = params[permitted_data[i]];
         }
       }
     }
   return selectedData;
 }
