var async            =   require('async');
var globalServices   =   require('../services/globalService');
var productModel     =   require('../models/productModel');
var products         =   new productModel();

module.exports = {
    'saveProduct': function(req, res, next){
        async.series([
            function(next) {
                products.saveProduct(req,res,next);
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
    'getProduct': function(req, res, next){
        async.series([
            function(next) {
                products.getProduct(req,res,next);
            }
        ],function(err, results) {
            if(err)
                res.status(409).json({status : 'error', message : err});
            else
            {
                res.status(200).json({status : 'success', message : results[0].length +' Product found.', data: results[0]});
            }
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
            {
                res.status(200).json({status : 'success', message : results[0].length +' Product found.', data: results[0]});
            }
        });
    }
}