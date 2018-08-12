var express         =   require('express');
var router          =   express.Router();
var restaurantCtrl  =   require('../controllers/restaurantCtrl');

router.get('/',                         restaurantCtrl.getAll);
router.get('/exists',                   restaurantCtrl.RestaurantExists);
router.post('/',                        restaurantCtrl.addRestaurant);
router.put('/:restaurantId',            restaurantCtrl.updateRestaurant);
router.delete('/:restaurantId',         restaurantCtrl.deleteRestaurant);
module.exports = router;
