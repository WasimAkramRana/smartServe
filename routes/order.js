var express         =   require('express');
var router          =   express.Router();
var orderCtrl  =   require('../controllers/orderCtrl');

router.get('/genrateOrderNumber',                   orderCtrl.generateOrderNumber);
router.get('/:restaurantId/:orderNumber/exists',    orderCtrl.orderExists);
router.get('/:restaurantId/:mobile?',               orderCtrl.getOrderList);
router.post('/:restaurantId/:mobile',               orderCtrl.addOrder);
router.put('/:orderId',                             orderCtrl.updateOrder);
router.delete('/:orderId',                          orderCtrl.deleteOrder);

module.exports = router;