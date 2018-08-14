var crypto = require('crypto');
var dbConnection = require('./dbConnection');

var userSchema = dbConnection.Schema({
<<<<<<< HEAD
    firstName           : String,
    lastName            : String,
    phone               : String,
    salt                : String,
    password            : String,
    isActive            :   Boolean,
    createdBy           :   String,
    createdAt           :   Number,
    updatedBy           :   String,
    updatedAt           :   Number
=======
    firstName: String,
    lastName: String,
    phone: String,
    salt: String,
    password: String,
    createdOn: Date
>>>>>>> d4eb1332272c7e61b24626e192281f6a7d848d32
});

/**
 * This model method is use for to verify duplicate user
 **/
userSchema.methods.verifyDuplicateUser = function(phone, req, res, next) {
    users.findOne({ phone: phone }, { phone: 1 }, function(err, response) {
        if (!response) {
            next();
        } else {
            res.status(401).json({ status: 'error', message: 'User already registered with this email', userExist: true });
        }
    });
}

/**
 * This model method is use for to save user details in database
 **/
userSchema.methods.saveUserDetails = function(validatorResponse, req, res, next) {
    let secretString = crypto.randomBytes(16).toString('hex');
<<<<<<< HEAD
    let currentTime = parseInt(((new Date()).getTime()/1000).toFixed());

=======
>>>>>>> d4eb1332272c7e61b24626e192281f6a7d848d32
    let userDetails = {
        firstName: validatorResponse.firstName,
        lastName: validatorResponse.lastName,
        phone: validatorResponse.phone,
        salt: secretString,
        password: crypto.pbkdf2Sync(validatorResponse.password, secretString, 1000, 32, 'sha256').toString('hex'),
<<<<<<< HEAD
        isActive        :   true,
        createdBy       :   "System",
        createdAt       :   currentTime,
        updatedBy       :   "System",
        updatedAt       :   currentTime
    }
    users.update({ phone: validatorResponse.phone, isActive : true}, { $set: userDetails }, { upsert: true }, function(err, data) {
=======
        createdOn: new Date()
    }
    users.update({ phone: validatorResponse.phone }, { $set: userDetails }, { upsert: true }, function(err, data) {
>>>>>>> d4eb1332272c7e61b24626e192281f6a7d848d32
        if (err) {
            	console.log(err);
		res.status(500).json({ status: 'error', message: 'Internal server error' });
        } else {
            console.log(data);
            next();
        }
    });
}

/**
 * This model method is used for to get login user details
 */
userSchema.methods.getUserDetails = function(phone, req, res, next) {
<<<<<<< HEAD
    users.findOne({ phone: phone, isActive : true }, function(err, response) {
=======
    users.findOne({ phone: phone }, function(err, response) {
>>>>>>> d4eb1332272c7e61b24626e192281f6a7d848d32
        if (response) {
            next(null, response._doc);
        } else {
            res.status(409).json({ status: 'error', message: 'User ID does not exist.' });
        }
    });
};

<<<<<<< HEAD
let users = dbConnection.smartServeDB.model('users', userSchema);
=======
let users = dbConnection.takedaTryDB.model('users', userSchema);
>>>>>>> d4eb1332272c7e61b24626e192281f6a7d848d32
module.exports = users;
