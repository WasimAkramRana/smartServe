var mongoose        =   require('mongoose');
var dbConnection    =   require('./dbConnection');
var SchemaTypes = mongoose.SchemaTypes;

var restaurantSchema  = dbConnection.Schema({
    _id                 :   SchemaTypes.ObjectId,
    name                :   String,
    serviceTaxNo        :   String,
    CSTNo               :   String,
    SGSTNo              :   String,
    location            :   String,
    contactPerson       :   String,
    mobile              :   String,
    products            :   [{
        _id             :   SchemaTypes.ObjectId,
        name            :   String,
        imageUrl        :   String,
        veg             :   Boolean,
        unit            :   [{
            _id         :   SchemaTypes.ObjectId,
            name        :   String,
            price       :   Number,
            offerPrice  :   Number
        }],
        isAvaliable     :   Boolean,
        detail          :   String
    }],
    tables              :   [{
        _id             :   SchemaTypes.ObjectId,
        name            :   String
    }],
    isActive            :   Boolean,
    createdBy           :   String,
    createdAt           :   Number,
    updatedBy           :   String,
    updatedAt           :   Number
  });

/**
* Validate that restaurant already exists with same name or not. 
*/
restaurantSchema.methods.exists = function (req,res,next)
{
    restaurants.findOne({name : req.query.name, isActive : true}, function(err, response) {
        if(response) {
          next(null, response._doc)
        } else {
            next('Restaurant does not exist.',null);
        }
      });
}
/**
 * This function add restaurant if already exits with same name then update records.
 */
restaurantSchema.methods.saveRestaurant = function (req,res,next)
{
    let currentTime = parseInt(((new Date()).getTime()/1000).toFixed());
    let restaurantDetails = {
        name            :   req.body.name,
        serviceTaxNo    :   req.body.serviceTaxNo,
        CSTNo           :   req.body.CSTNo,
        SGSTNo          :   req.body.SGSTNo,
        location        :   req.body.location,
        contactPerson   :   req.body.contactPerson,
        mobile          :   req.body.mobile,
        products        :   req.body.products,
        tables          :   req.body.tables,
        isActive        :   true,
        updatedBy       :   "System",
        updatedAt       :   currentTime
    }

    //Verfiy request type is for create or update.
    if(!req.body._id){
        restaurantDetails.createdBy = "System";
        restaurantDetails.createdAt =  currentTime;
    }
    restaurants.update({name : req.body.name, isActive : true},{$set : restaurantDetails}, {upsert:true}, function(err, response) {
        if(response) {
          next(null, response)
        } else {
          res.status(409).json({status: 'error', message: 'Restaurant does not exist.'});
        }
      });
}

/**
 * This function is return all restaurant avaliable.
 */
restaurantSchema.methods.getAll = function(req,res,next){
    restaurants.find({isActive : true}, function(err, response) {
        if(response) {
          next(null, response)
        } else {
          res.status(409).json({status: 'error', message: 'Restaurant does not exist.'});
        }
      });
}

/**
 * This function is used to delete active restaurant
 * @param {*} restaurantId is restaurant system generated Id
 */
restaurantSchema.methods.deleteRestaurant = function(restaurantId,req,res,next){
    let currentTime = parseInt(((new Date()).getTime()/1000).toFixed());
    restaurants.updateOne({_id : restaurantId, isActive : true},{
        $set : {
        isActive    : false,
        updatedBy   : "System",
        updatedAt   : currentTime
        }
    },
    {new: true},
    function(err, response) {
        if(response) {
          next(null, response)
        } else {
          res.status(409).json({status: 'error', message: 'Restaurant does not exist.'});
        }
      });
}
/**
 * This function help to search products in particuar restaurant
 * @param {*} restaurantId is restaurant system generated Id
 * E.g. filter options in query: veg: true, name: <item name>
 */
restaurantSchema.methods.getProducts = function(restaurantId,req,res,next){
    let findQuery = { _id :mongoose.Types.ObjectId(restaurantId), isActive : true };

    let filterOptions = "";

    //Veg / Non Veg Search Options
    if(req.query.veg != undefined)
        filterOptions = {'$eq':["$$product.veg",req.query.veg.toLowerCase() === "true" ? true : false]};

    //Name Search Options
    if(req.query.name != undefined){
        
        if(filterOptions != "") {
            filterOptions = {$and:[
                filterOptions,
                {'$eq':["$$product.name",req.query.name.trim()]}
                  ]}
        }
        else{
            filterOptions = {'$eq':["$$product.name",req.query.name.trim()]};
        }
    }
      
    if(filterOptions != ""){
        filterOptions =
                {"products":{
                        $filter:{
                            input:"$products",
                            as:	"product",
                            cond:filterOptions
                        }
                    }
                }
      }

    let projection = {"_id":1,name:1,"products":1};
    
    if(filterOptions != "")
        var finalQuery = [{$match: findQuery},{$addFields: filterOptions},{$project: projection}];
    else
        var finalQuery = [{$match:findQuery},{$project:projection}];

    restaurants.aggregate(finalQuery,
        function(err, response) {
            if(response) {
            next(null, response);
            } else {
                res.status(409).json({status: 'error', message: 'No Product found.'});
            }
        }
    );

}

let restaurants  = dbConnection.smartServeDB.model('restaurants', restaurantSchema);
module.exports   = restaurants;
