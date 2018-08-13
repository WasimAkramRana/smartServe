var async            =   require('async');
var globalServices   =   require('../services/globalService');
var productModel     =   require('../models/productModel');
var products         =   new productModel();

module.exports = {
    'productExists': function(req, res, next){
        async.waterfall([
            function(next) {
                products.productExists(req.params.restaurantId,req.query.name,req,res,next);
            }
        ],function(err, results) {
            if(err)
                res.status(409).json({status : 'error', message : err});
            else
                res.status(200).json({status : 'success', message : (results != null ? true: false)});
        });
    },
    'addProduct': function(req, res, next){
        async.waterfall([
            function(next) {
                products.productExists(req.params.restaurantId,req.body.name,req,res,next);
            },
            function(result, next) {
                if(result === null)
                    products.addProduct(req,res,next);
                else
                    next("Product already exits",null);
            }
        ],function(err, results) {
            if(err)
                res.status(409).json({status : 'error', message : err});
            else
                res.status(200).json({status : 'success', message : 'Congratulations! Successfully added.'});
        });
    },
    'updateProduct': function(req, res, next){
        async.waterfall([
            function(next) {
                products.productExists(req.params.restaurantId,req.body.name,req,res,next);
            },
            function(result, next) {
                if(result != null && result._doc._id.toString() == req.params.productId)
                    products.updateProduct(req,res,next);
                else
                    next("Product not found.",null);
            }
        ],function(err, results) {
            if(err)
                res.status(409).json({status : 'error', message : err});
            else
                res.status(200).json({status : 'success', message : 'Congratulations! Successfully updated.'});
        });
    },
    'getProduct': function(req, res, next){
        async.series([
            function(next) {
                products.getProduct(req,res,next);
            }
        ],function(err, results) {
            if(err)
                res.status(409).json({status : 'error', message : err});
            else
                res.status(200).json({status : 'success', message : results[0].length +' Product found.', data: results[0]});
        });
    },
    'deleteProduct': function(req, res, next){
        async.series([
            function(next) {
                products.deleteProduct(req,res,next);
            }
        ],function(err, results) {
            if(err)
                res.status(409).json({status : 'error', message : err});
            else
                res.status(200).json({status : 'success', message : results[0].length +' Product found.', data: results[0]});
        });
    }
}