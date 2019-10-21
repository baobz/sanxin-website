let express = require('express');
let router = express.Router();

let page_controller = require('../controllers/pageController');
let catalog_controller = require('../controllers/catalogController');
let product_controller = require('../controllers/productController');

router.get('/index', page_controller.page_index_get);
router.get('/about', page_controller.page_about_get);
router.get('/culture', page_controller.page_culture_get);
router.get('/products', page_controller.page_products_get);
router.get('/contact', page_controller.page_contact_get);
router.get('/map', page_controller.page_map_get);
router.get('/products/:id', page_controller.product_detail_get);
router.get('/products/BigClass/:id', page_controller.product_catalog_get);

/* 添加编辑 start */
router.get('/edit-catalog', catalog_controller.catalog_edit_get);
router.get('/edit-product', product_controller.product_edit_get);
router.post('/fenlei/post', catalog_controller.catalog_edit_post);
router.post('/shangpin/post', product_controller.product_edit_post);
/* 添加编辑 start */

module.exports = router;
