var express         =   require('express');
var router          =   express.Router();
var restaurantCtrl  =   require('../controllers/restaurantCtrl');

router.get('/',         restaurantCtrl.getAll);
router.get('/exist',    restaurantCtrl.exists);
router.post('/',        restaurantCtrl.saveData);

module.exports = router;
