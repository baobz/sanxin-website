var express = require('express');
var router = express.Router();
let page_controller = require('../controllers/pageController');

/* GET home page. */
router.get('/', page_controller.page_index_get);

module.exports = router;
