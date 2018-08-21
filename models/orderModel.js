var mongoose        =   require('mongoose');
var dbConnection    =   require('./dbConnection');
var SchemaTypes     = mongoose.SchemaTypes;

var orderSchema = dbConnection.Schema({
    _id                 : SchemaTypes.ObjectId,
    mobile              : {type: SchemaTypes.ObjectId, ref: 'users'},
    restaurant          : {type: SchemaTypes.ObjectId, ref: 'restaurants'},
    orderNumber         : String,
    products            :[{
    _id                 : SchemaTypes.ObjectId,
    productId           : {type: SchemaTypes.ObjectId, ref: 'products'},
    name                : String,
    isVeg               : Boolean,
    isAvaliable         : Boolean,
    unit                : String,
    price               : Number,
    offerPrice          : Number,
    quantity            : Number
    }],
    subTotal            : Number,
    serviceTax          : Number,
    CST                 : Number,
    SGST                : Number,
    total               : Number,
    orderStatus         : String,
    paymentOption       : String,
    paymentRefNo        : String,
    paymentDone         : Boolean,
    isActive            : Boolean,
    createdBy           : String,
    createdAt           : Number,
    updatedBy           : String,
    updatedAt           : Number
});

orderSchema.methods.orderExists = function(restaurantId,orderNumber,req, res, next){
    restaurantId = mongoose.Types.ObjectId(restaurantId);

    orders.findOne({restaurant: restaurantId, orderNumber: orderNumber, isActive: true},function(err, response){
        if(!err ) {
            next(null, response);
          } else {
            res.status(409).json({status: 'error', message: 'Order not found.'});
          }
    });
}

orderSchema.methods.getOrderList = function(req,res,next){

    let restaurantId = mongoose.Types.ObjectId(req.params.restaurantId);
    let findQuery = {"restaurant": restaurantId, isActive: true}
    
    if(req.params.mobile != undefined && req.params.mobile != null)
    {
        let mobile = mongoose.Types.ObjectId(req.params.mobile);
        findQuery=  {"restaurant": restaurantId, "mobile": mobile, isActive: true}
    }
        
    orders.find(findQuery,function(err, response){
        if(!err ) {
            next(null, response);
          } else {
            res.status(409).json({status: 'error', message: 'Some error found. Please try later.'});
          }
    });
}

orderSchema.methods.addOrder = function(req,res,next){

    let restaurantId = mongoose.Types.ObjectId(req.params.restaurantId);
    let mobile = mongoose.Types.ObjectId(req.params.mobile);
    let currentTime = parseInt(((new Date()).getTime()/1000).toFixed());


    let orderDetails = {
        _id             : new mongoose.Types.ObjectId(),
        mobile          : mobile,
        restaurant      : restaurantId,
        orderNumber     : req.body.orderNumber,
        subTotal        : req.body.subTotal,
        serviceTax      : req.body.serviceTax,
        CST             : req.body.CST,
        SGST            : req.body.SGST,
        total           : req.body.total,
        orderStatus     : req.body.orderStatus,
        paymentOption   : req.body.paymentOption,
        paymentRefNo    : req.body.paymentRefNo,
        paymentDone     : req.body.paymentDone,
        isActive        : true,
        createdBy       : 'System',
        createdAt       : currentTime,
        updatedBy       : 'System',
        updatedAt       : currentTime
    };

    orderDetails.products = [];
    req.body.products.forEach(function(product){
        orderDetails.products.push({
            name        : req.body.name,
            isVeg       : req.body.isVeg,
            isAvaliable : req.body.isAvaliable,
            unit        : req.body.unit,
            price       : req.body.price,
            offerPrice  : req.body.offerPrice,
            quantity    : req.body.quantity
        });
    });

    orders.create(orderDetails, function(err, response) {
        if(!err ) {
          next(null, response);
        } else {
          res.status(409).json({status: 'error', message: 'Something went wrong please try again.'});
        }
      });
}

orderSchema.methods.updateOrder = function(req,res,next){
    orderId = mongoose.Types.ObjectId(req.params.orderId);

    let currentTime = parseInt(((new Date()).getTime()/1000).toFixed());


    let orderDetails = {
        subTotal        : req.body.subTotal,
        serviceTax      : req.body.serviceTax,
        CST             : req.body.CST,
        SGST            : req.body.SGST,
        total           : req.body.total,
        orderStatus     : req.body.orderStatus,
        paymentOption   : req.body.paymentOption,
        paymentRefNo    : req.body.paymentRefNo,
        paymentDone     : req.body.paymentDone,
        updatedBy       : 'System',
        updatedAt       : currentTime
    };

    orderDetails.products = [];
    req.body.products.forEach(function(product){
        orderDetails.products.push({
            name        : req.body.name,
            isVeg       : req.body.isVeg,
            isAvaliable : req.body.isAvaliable,
            unit        : req.body.unit,
            price       : req.body.price,
            offerPrice  : req.body.offerPrice,
            quantity    : req.body.quantity
        });
    });

    orders.update({_id: orderId, isActive : true},{$set : orderDetails},function(err, response) {
        if(!err ) {
          next(null, response);
        } else {
          res.status(409).json({status: 'error', message: 'Order does not exist.'});
        }
      });
}

orderSchema.methods.deleteOrder = function(req,res,next){
    let orderId = mongoose.Types.ObjectId(req.params.orderId);

    let currentTime = parseInt(((new Date()).getTime()/1000).toFixed());


    let orderDetails = {
        isActive        : false,
        updatedBy       : 'System',
        updatedAt       : currentTime
    };

    orders.update({_id: orderId, isActive : true},{$set : orderDetails},function(err, response) {
        if(!err ) {
          next(null, response);
        } else {
          res.status(409).json({status: 'error', message: 'Order does not exist.'});
        }
      });
}

let orders  = dbConnection.smartServeDB.model('orders', orderSchema);
module.exports   = orders;