db.getCollection("restaurants").aggregate([
	{$match: {"_id": ObjectId("5b6c33806def7e0bcd212096")}},
	{$addFields:
  		{"products":{$filter:{
			input:"$products",
			as:	"product",
			cond:{$and:[
			  {'$eq':["$$product.veg",true]},
			  {'$eq':["$$product.name","Tandoori Fish"]}
				]}
  			}
		}
	  }
	},
	{$project:{"_id":1,"name":1,"products":1}}
]);

db.getCollection("restaurants").aggregate([
	{$match: {"_id": ObjectId("5b6c33806def7e0bcd212096")}},
	{$addFields:
  		{"products":{$filter:{
			input:"$products",
			as:	"product",
			cond:{
			  	'$eq':["$$product.veg",true]
				}
  			}
		}
	  }
	},
	{$project:{"_id":1,"name":1,"products":1}}
]);

https://github.com/WasimAkramRana/smartServe.git
https://github.com/WasimAkramRana/smartServe/tree/restaurant

{
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
    }

http://mongoosejs.com/docs/api.html#query_Query-lean
http://104.211.74.123:3090/swagger
