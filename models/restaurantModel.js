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
restaurantSchema.methods.saveData = function (req,res,next)
{
    let currentTime = (new Date()).getTime();
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
 * This function help to search products in particuar restaurant
 * @param {*} restaurantId is restaurant system generated Id
 * @param {*} searchOptions in this object user can pass filter parameter 
 * E.g. searchOptions: {veg: true, name: <item name>}
 */
restaurantSchema.methods.searchProduct = function(restaurantId,searchOptions,req,res,next){
    let findQuery = { _id :   restaurantId, isActive : true }

    //Veg / Non Veg Search Options
    if(searchOptions.veg != undefined)
        findQuery['products.veg'] = searchOptions.veg

    //Name Search Options
    if(searchOptions.name != undefined)
        findQuery['products.name'] = searchOptions.name

    restaurants.find(findQuery,{_id : 0 , products : 1}, function(err, response) {
        if(response) {
          next(null, response._doc)
        } else {
          res.status(409).json({status: 'error', message: 'No matching product found.'});
        }
      });
}

let restaurants  = dbConnection.smartServeDB.model('restaurants', restaurantSchema);
module.exports   = restaurants;
