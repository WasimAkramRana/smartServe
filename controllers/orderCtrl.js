var async           = require('async');
var crypto          = require('crypto');
var globalServices  = require('../services/globalService');
var orderModel      = require('../models/orderModel');
var orders          = new orderModel();

module.exports = {
    'generateOrderNumber': function(req, res, next){
        let orderNumber = crypto.randomBytes(8).toString().toUpperCase()+"-"+(new Date()).getTime().toString();

        res.status(200).json({status : 'success', message : orderNumber});
    },
    'orderExists': function(req, res, next){
        async.waterfall([
            function(next) {
                orders.orderExists(req.params.restaurantId,req.params.orderNumber,req,res,next);
            }
        ],function(err, results) {
            if(err)
                res.status(409).json({status : 'error', message : err});
            else
                res.status(200).json({status : 'success', message : (results != null ? true: false)});
        });
    },
    'getOrderList': function(req, res, next){
        async.waterfall([
            function(next) {
                orders.getOrderList(req, res, next);
            }
        ],function(err, results) {
            if(err)
                res.status(409).json({status : 'error', message : err});
            else
                res.status(200).json({status : 'success', message : results[0].length +' Order found.', data: results[0]});
        });
    },
    'addOrder': function(req, res, next){
        async.waterfall([
            function(next) {
                orders.orderExists(req.params.restaurantId,req.body.orderNumber,req,res,next);
            },
            function(result, next) {
                if(result === null)
                orders.addOrder(req,res,next);
                else
                    next("Order already exits",null);
            }
        ],function(err, results) {
            if(err)
                res.status(409).json({status : 'error', message : err});
            else
                res.status(200).json({status : 'success', message : 'Congratulations! Successfully added.'});
        });
    },
    'updateOrder': function(req, res, next){
        async.waterfall([
            function(next) {
                orders.orderExists(req.params.restaurantId,req.body.orderNumber,req,res,next);
            },
            function(result, next) {
                if(result != null)
                orders.updateOrder(req,res,next);
                else
                    next("Order not exits",null);
            }
        ],function(err, results) {
            if(err)
                res.status(409).json({status : 'error', message : err});
            else
                res.status(200).json({status : 'success', message : 'Congratulations! Successfully updated.'});
        });
    },
    'deleteOrder': function(req, res, next){
        async.waterfall([
            function(next) {
                orders.orderExists(req.params.restaurantId,req.body.mobile,req,res,next);
            },
            function(result, next) {
                if(result != null)
                orders.deleteOrder(req,res,next);
                else
                    next("Order not exits",null);
            }
        ],function(err, results) {
            if(err)
                res.status(409).json({status : 'error', message : err});
            else
                res.status(200).json({status : 'success', message : 'Congratulations! Successfully deleted.'});
        });
    }
}