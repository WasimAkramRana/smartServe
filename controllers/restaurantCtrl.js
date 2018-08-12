var async               =   require('async');
var globalServices      =   require('../services/globalService');
var restaurantModel     =   require('../models/restaurantModel');
var restaurants         =   new restaurantModel();

module.exports = {
    'getAll': function(req,res,next){
        async.series([
            /* function(next) {
                globalServices.validateAccessToken(req, res, next); //Validate access token
            }, */
            function(next){
                restaurants.getAll(req,res,next);
            }
        ],function(err, results) {
            if(err)
                res.status(409).json({status : 'error', message : err}); 
            else
                res.status(200).json({status : 'success', message : results.length +' Restaurant found.',data : results});
        });
    },
    'RestaurantExists': function(req,res,next){
        async.series([
            function(next) {
            restaurants.RestaurantExists(req,res,next);
            }
        ],function(err, results) {
            if(err)
                res.status(409).json({status : 'error', message : err});
            else
                res.status(200).json({status : 'success', message : results});
        });
    },
    'addRestaurant': function(req, res, next){
        async.waterfall([
            function(next) {
                restaurants.RestaurantExists(req,res,next);
            },
            function(result, next) {
                if(!result)
                    restaurants.addRestaurant(req,res,next);
                else
                    next('Restaurant already exists.', null);
            }
        ],function(err, results) {
            if(err)
                res.status(409).json({status : 'error', message : err});
            else
                res.status(200).json({status : 'success', message : 'Congratulations! Successfully added.'});
        });
    },
    'updateRestaurant': function(req, res, next){
        async.waterfall([
            function(next) {
                restaurants.RestaurantExists(req,res,next);
            },
            function(result, next) {
                if(result)
                    restaurants.updateRestaurant(req,res,next);
                else
                    next('Restaurant not found.', null);
            }
        ],function(err, results) {
            if(err)
                res.status(409).json({status : 'error', message : err});
            else
               res.status(200).json({status : 'success', message : 'Congratulations! Successfully updated.'});
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
