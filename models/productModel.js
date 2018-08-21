var mongoose        =   require('mongoose');
var dbConnection    =   require('./dbConnection');
var SchemaTypes     = mongoose.SchemaTypes;

var productSchema  = dbConnection.Schema({
    _id                 :   SchemaTypes.ObjectId,
    restaurant          :   { type: SchemaTypes.ObjectId, ref: 'restaurants' },
    name                :   String,
    imageUrl            :   String,
    isVeg               :   Boolean,
    unit                :   [{
            _id         :   SchemaTypes.ObjectId,
            name        :   String,
            price       :   Number,
            offerPrice  :   Number
    }],
    isAvaliable         :   Boolean,
    detail              :   String,
    isActive            :   Boolean,
    createdBy           :   String,
    createdAt           :   Number,
    updatedBy           :   String,
    updatedAt           :   Number
  });

productSchema.methods.productExists = function(restaurantId,name,req, res, next){
    restaurantId = mongoose.Types.ObjectId(restaurantId);

    products.findOne({restaurant: restaurantId, name: { $regex : new RegExp(name, "i") }, isActive: true},function(err, response){
        if(!err ) {
            next(null, response);
          } else {
            res.status(409).json({status: 'error', message: 'Product not found.'});
          }
    });
}

productSchema.methods.addProduct = function(req,res,next){

    let currentTime = parseInt(((new Date()).getTime()/1000).toFixed());
    let restaurantId = mongoose.Types.ObjectId(req.params.restaurantId);

    let productDetails = {
        _id         : new mongoose.Types.ObjectId(),
        restaurant  : restaurantId,
        name        : req.body.name,
        imageUrl    : req.body.imageUrl,
        isVeg       : req.body.isVeg,
        unit        : req.body.unit,
        detail      : req.body.detail,
        isAvaliable : req.body.isAvaliable,
        isActive    : true,
        createdBy   : 'System',
        createdAt   : currentTime,
        updatedBy   : 'System',
        updatedAt   : currentTime
    };

    products.create(productDetails, function(err, response) {
        if(!err ) {
          next(null, response);
        } else {
          res.status(409).json({status: 'error', message: 'Something went wrong please try again.'});
        }
      });
}

productSchema.methods.updateProduct = function(req,res,next){

    let currentTime = parseInt(((new Date()).getTime()/1000).toFixed());
    let restaurantId = mongoose.Types.ObjectId(req.params.restaurantId);
    let productId = mongoose.Types.ObjectId(req.params.productId);
    
    let productDetails = {
        restaurant  : restaurantId,
        name        : req.body.name,
        imageUrl    : req.body.imageUrl,
        isVeg       : req.body.isVeg,
        unit        : req.body.unit,
        detail      : req.body.detail,
        isAvaliable : req.body.isAvaliable,
        updatedBy   : 'System',
        updatedAt   : currentTime
    };

products.update({_id: productId, restaurant  : productDetails.restaurantId, isActive : true},{$set : productDetails},function(err, response) {
        if(!err ) {
          next(null, response);
        } else {
          res.status(409).json({status: 'error', message: 'Product does not exist.'});
        }
      });
    }
productSchema.methods.getProduct = function(req, res, next){
    let restaurantId = mongoose.Types.ObjectId(req.params.restaurantId);

/*     products.find({restaurant: restaurantId , isActive: true}).populate('restaurant').exec(function(err, response){
        if(!err ) {
            next(null, response)
          } else {
            res.status(409).json({status: 'error', message: 'Product does not exist.'});
          }
    }) */
 
    let findQuery = {restaurant: restaurantId, isActive : true};
    let isVeg = req.query.isVeg || req.query.isveg;
    let isAvaliable = req.query.isAvaliable || req.query.isavaliable;

    if(isVeg != undefined)
        findQuery.isVeg = isVeg.toLowerCase() === "true" ? true : false;

    if(req.query.name != undefined)
        findQuery.name = req.query.name.trim();

    if(isAvaliable != undefined)
        findQuery.isAvaliable = isAvaliable.toLowerCase() === "true" ? true : false;

    products.find(findQuery,{name:1, imageUrl:1, isVeg:1, unit:1, detail:1, isAvaliable:1},function(err, response){
        if(!err ) {
            next(null, response)
          } else {
            res.status(409).json({status: 'error', message: 'Product does not exist.'});
          }
    });
}

productSchema.methods.deleteProduct = function(req, res, next){

    let currentTime = parseInt(((new Date()).getTime()/1000).toFixed());
    let restaurantId = mongoose.Types.ObjectId(req.params.restaurantId);
    let productId = mongoose.Types.ObjectId(req.params.productId);

    products.update({_id : productId, restaurant: restaurantId, isActive : true},{$set : {isActive : false, updatedAt : currentTime}}, function(err, response) {
        if(!err ) {
          next(null, response)
        } else {
          res.status(409).json({status: 'error', message: 'Product does not exist.'});
        }
      });
}

let products  = dbConnection.smartServeDB.model('products', productSchema);
module.exports   = products;