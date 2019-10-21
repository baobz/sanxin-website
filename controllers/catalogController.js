const Catalog = require('../models/catalog')
const async = require('async');

const {body, validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');

const moment = require('moment');

exports.catalog_edit_get = function (req, res, next) {
    res.render('edit-catalog.html')
}

exports.catalog_edit_post = [
    body('catalog').isLength({min: 1}).trim().withMessage('分类必须填写.'),
    body('c_code').isLength({min: 1}).trim().withMessage('分类必须填写.'),
    sanitizeBody('catalog').escape(),
    sanitizeBody('c_code').escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        const catalog = new Catalog(
            {
                catalog: req.body.catalog,
                c_code: req.body.c_code
            }
        );

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('edit-catalog.html', {title: 'Create Catalog', catalog: catalog, errors: errors.array()});
            return;
        } else {
            // Save catalog.
            catalog.save(function (err) {
                if (err) {
                    return next(err);
                }
                // 表单提交成功跳转页面
                res.redirect('/catalog/edit-catalog');
            });
        }
    }
]
