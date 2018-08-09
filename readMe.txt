db.getCollection("restaurants").aggregate([
	{$match: {"_id": ObjectId("5b6c33806def7e0bcd212096")}},
	{$addFields:
  		{"products":{$filter:{
			input:"$products",
			as:	"product",
			cond:{
			  '$eq':["$$product.veg",false],
			  '$eq':["$$product.name","Tandoori Fish"]
				}
  			}
		}
	  }
	},
	{$project:{"_id":1,"name":1,"products":1}}
]);

