var mongoose        =   require('mongoose');
var dbConnection    =   require('./dbConnection');
var SchemaTypes = mongoose.SchemaTypes;

var productSchema  = dbConnection.Schema({
    _id                 :   SchemaTypes.ObjectId,
    restaurant          :   { type: SchemaTypes.ObjectId, ref: 'restaurants' },
    name                :   String,
    imageUrl            :   String,
    isVeg                 :   Boolean,
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

productSchema.methods.saveProduct = function(req,res,next){

    let currentTime = parseInt(((new Date()).getTime()/1000).toFixed());
    
    let productDetails = {
        restaurant  : mongoose.Types.ObjectId(req.params.restaurantId),
        name        : req.body.name,
        imageUrl    : req.body.imageUrl,
        isVeg       : req.body.isVeg,
        unit        : req.body.unit,
        detail      : req.body.detail,
        updatedBy   : 'System',
        updatedAt   : currentTime
    };

    //Verfiy request type is for create or update.
    if(!req.body._id){
        productDetails.createdBy = "System";
        productDetails.createdAt =  currentTime;
    }
    else
        productDetails._id = mongoose.Types.ObjectId(req.body._id);

    products.update({name : productDetails.name, isActive : true},{$set : productDetails}, {upsert:true}, function(err, response) {
        if(!err ) {
          next(null, response)
        } else {
          res.status(409).json({status: 'error', message: 'Product does not exist.'});
        }products
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

    if(isVeg != undefined)
        findQuery.isVeg = isVeg.toLowerCase() === "true" ? true : false;

    if(req.query.name != undefined)
        findQuery.name = req.query.name.trim();

    products.find(findQuery,{name:1,imageUrl:1,isVeg:1,unit:1,detail:1},function(err, response){
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