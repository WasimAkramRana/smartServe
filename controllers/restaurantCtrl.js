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
                res.status(409).json({status : 'error', message : err}); 
            else
                res.status(200).json({status : 'success', message : results[0].length +' Restaurant found.',data:results[0]});
        });
    },
    'exists': function(req,res,next){
        async.series([
            function(next) {
            restaurants.exists(req,res,next);
            }
        ],function(err, results) {
            if(err)
                res.status(409).json({status : 'error', message : err});
            else
                res.status(200).json({status : 'success', message : 'Restaurant found.',data:results});
        });
    },
    'saveRestaurant': function(req, res, next){
        async.series([
            function(next) {
            restaurants.saveRestaurant(req,res,next);
            }
        ],function(err, results) {
            if(err)
                res.status(409).json({status : 'error', message : err});
            else
            {
                let messageText = 'Congratulations! Successfully added.'

                if(!results[0].upserted)
                    messageText = 'Congratulations! Successfully updated.'

                res.status(200).json({status : 'success', message : messageText});
            }
        });
    },
    'deleteRestaurant': function(req, res, next){
        var restaurantId = req.params.restaurantId;
        async.series([
            function(next) {
            restaurants.deleteRestaurant(restaurantId,req,res,next);
            }
        ],function(err, results) {
            if(err)
                res.status(409).json({status : 'error', message : err});
            else{
                  if(results[0].nModified > 0)
                        res.status(200).json({status : 'success', message :'Congratulations! restaurant successfully deleted.'});
                    else
                        res.status(409).json({status : 'error', message : "No active restaurant found for delete."});
            }
        });
    },
    'getProducts' :function(req, res, next){
        var restaurantId = req.params.restaurantId;
        async.series([
            function(next) {
            restaurants.getProducts(restaurantId, req, res, next);
            }
        ],function(err, results) {
            if(err)
                res.status(200).json({status : 'error', message : err});
            else 
                res.status(200).json({status : 'success', message : results[0][0].products.length +" products found.", data: results[0][0]});
        });
    }
}
