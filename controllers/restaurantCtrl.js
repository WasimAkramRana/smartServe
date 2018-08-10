var async               =   require('async');
var restaurantModel     =   require('../models/restaurantModel');
var restaurants         =   new restaurantModel();

module.exports = {
    'getAll': function(req,res,next){
        async.series([
            function(next) {
            restaurants.getAll(req,res,next);
            }
        ],function(err, results) {
            if(err)
                res.status(200).json({status : 'error', message : err}); //Send API request response
            else
                res.status(200).json({status : 'success', message : results[0].length +' Restaurant found.',data:results[0]}); //Send API request response
        })
    },
    'exists': function(req,res,next){
        async.series([
            function(next) {
            restaurants.exists(req,res,next);
            }
        ],function(err, results) {
            if(err)
                res.status(200).json({status : 'error', message : err}); //Send API request response
            else
                res.status(200).json({status : 'success', message : 'Restaurant found.',data:results}); //Send API request response
        })
    },
    'saveData': function(req,res,next){
        async.series([
            function(next) {
            restaurants.saveData(req,res,next);
            }
        ],function(err, results) {
            if(err)
                res.status(200).json({status : 'error', message : err}); //Send API request response
            else
            {
                let messageText = 'Congratulations! Successfully added.'
                if(!results[0].upserted)
                messageText = 'Congratulations! Successfully updated.'
                res.status(200).json({status : 'success', message : messageText}); //Send API request response
            }
                
        })
    }
}
