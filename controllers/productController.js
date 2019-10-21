const Product = require('../models/product');
const Catalog = require('../models/catalog');
const async = require('async');

const {body, validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');

const moment = require('moment');

exports.product_edit_get = function (req, res, next) {
    async.parallel({
        catalogs: function(callback) {
            Catalog.find(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        res.render('edit-product.html', { title: 'Create Product',catalogs: results.catalogs });
    });
}

// 商品新增
exports.product_edit_post = [
    body('p_name').isLength({min: 1}).trim().withMessage('商品名称必须填写.'),
    body('p_summary').isLength({min: 1}).trim().withMessage('商品描述必须填写.'),
    body('p_catalog').isLength({min: 1}).trim().withMessage('商品类型必填.'),
    sanitizeBody('p_name').escape(),
    sanitizeBody('p_summary').escape(),
    sanitizeBody('p_catalog').escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        const product = new Product(
            {
                p_name: req.body.p_name,
                p_summary: req.body.p_summary,
                p_num: req.body.p_num,
                p_catalog: req.body.p_catalog,
                p_cover: req.body.p_cover,
                created_date: Date.now(), // 默认存储 时区少8小时
                update_date: Date.now() // 默认存储 时区少8小时
            }
        );

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('edit-product.html', {title: 'Create Catalog', catalog: catalog, errors: errors.array()});
            return;
        } else {
            // Save catalog.
            product.save(function (err) {
                if (err) {
                    return next(err);
                }
                // 表单提交成功跳转页面
                res.redirect('/catalog/edit-product');
            });
        }
    }
]



