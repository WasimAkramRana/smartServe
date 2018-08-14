var express         =   require('express');
var router          =   express.Router();
var productCtrl  =   require('../controllers/productCtrl');

router.get('/:restaurantId/exists',         productCtrl.productExists);
router.get('/:restaurantId',                productCtrl.getProduct);
router.post('/:restaurantId',               productCtrl.addProduct);
router.put('/:restaurantId/:productId',     productCtrl.updateProduct);
router.delete('/:restaurantId/:productId',  productCtrl.deleteProduct);

module.exports = router;