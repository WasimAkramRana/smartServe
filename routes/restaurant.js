var express         =   require('express');
var router          =   express.Router();
var restaurantCtrl  =   require('../controllers/restaurantCtrl');

router.get('/',                         restaurantCtrl.getAll);
router.get('/exist',                    restaurantCtrl.exists);
router.post('/',                        restaurantCtrl.saveRestaurant);
router.get('/:restaurantId/products',   restaurantCtrl.getProducts);
router.delete('/:restaurantId',         restaurantCtrl.deleteRestaurant);
module.exports = router;
