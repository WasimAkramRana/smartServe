var express         =   require('express');
var router          =   express.Router();
var productCtrl  =   require('../controllers/productCtrl');

router.get('/:restaurantId',                productCtrl.getProduct);
router.post('/:restaurantId',               productCtrl.saveProduct);
router.delete('/:restaurantId/:productId',  productCtrl.deleteProduct);
/*router.get('/:restaurantId/:productName',                    productCtrl.exists); */

module.exports = router;