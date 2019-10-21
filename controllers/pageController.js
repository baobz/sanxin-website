const md5 = require('js-md5');
const async = require('async');
const Product = require('../models/product');
const Catalog = require('../models/catalog');

// 首页路由
exports.page_index_get = function (req, res, next) {
    async.parallel({
        products: function(callback) {
            Product.find({}, {products: {$slice: 1}})
                .sort({created_date: -1})
                .limit(5)
                .exec(callback);
        }
    }, (err, result)=>{
        if(err) {return next(err)};
        res.render('index.html', {
            url: 'index',
            hotProducts: result.products
        })
    })
}

// 关于我们
exports.page_about_get = function (req, res, next) {
    res.render('about.html', {
        url: 'about',
        title: 'About Us',
        current: 'about',
        navItem: [
            {subTitle: 'Company Profile', url: '/catalog/about'},
            {subTitle: 'Company service', url: '/catalog/culture'}
        ]
    });
}

// 企业文化
exports.page_culture_get = function (req, res, next) {
    res.render('culture.html', {
        url: 'about',
        title: 'About Us',
        current: 'culture',
        navItem: [
            {subTitle: 'Company Profile', url: '/catalog/about'},
            {subTitle: 'Company service', url: '/catalog/culture'}
        ]
    });
}

// 产品列表
exports.page_products_get = (req, res, next) => {
    const {pageNum=1, pageSize=12} = req.query;
    async.parallel({
        products: function(callback) {
            Product.find({})
                .skip((pageNum -1)* pageSize)
                .limit(+pageSize)
                .sort({created_date: 1})
                .exec(callback);
        },
        total: function(callback) {
            Product.countDocuments(callback);
        },
        catalogs: function(callback) {
            Catalog.find(callback)
        }
    }, function(err, results) {
        // console.log(results.total);
        if (err) { return next(err); }
        res.render('products.html', {
            url: 'products',
            title: 'Products',
            current: 'products',
            catalogs: results.catalogs,
            products: results.products,
            pageNum: pageNum,
            total: results.total,
            pageSize: pageSize
        });
    });
};

// 产品分类
exports.product_catalog_get = function(req, res, next) {
    const {pageNum=1, pageSize=12} = req.query;
    async.parallel({
        products: function(callback) {
            Product.find({p_catalog: req.params.id})
                .skip((pageNum -1)* pageSize)
                .limit(+pageSize)
                .sort({created_date: 1})
                .exec(callback);
        },
        total: function(callback) {
            Product.find({p_catalog: req.params.id})
                .countDocuments(callback);
        },
        catalogs: function(callback) {
            Catalog.find(callback)
        }
    }, (err, results)=>{
        // console.log('分类', results)
        if(err) {return next(err);}
        res.render('products.html', {
            url: 'products',
            title: 'Products',
            current: 'products',
            catalogs: results.catalogs,
            products: results.products,
            pageNum: pageNum,
            total: results.total,
            pageSize: pageSize
        });
    })
}

// 产品详情
exports.product_detail_get = function(req, res, next) {
    console.log('detail=======>',req.params.id);
    async.parallel({
        product: function(callback) {
            Product.findById(req.params.id)
                .populate('catalog')
                .exec(callback);
        },
        catalogs: function(callback) {
            Catalog.find(callback)
        }
    }, (err, results) => {
        console.log('results detail=============>', results);
        if (err) { return next(err); }
        if (results.product==null) { // No results.
            var err = new Error('没有商品');
            err.status = 404;
            return next(err);
        }

        async.parallel({
            productPrev: (callback) => {
                Product.find({created_date: {$lt: results.product.created_date}}).sort({created_date: -1}).limit(1) // TODO: 查询上一条
                    .exec(callback)
            },
            productNext: function(callback) {
                Product.find({created_date: {$gt: results.product.created_date}}).sort({created_date: 1}).limit(1) // TODO: 查询下一条
                    .exec(callback)
            }
        }, (err, rlt) => {
            if (err) { return next(err); }
            if (results.product==null) { // No results.
                var err = new Error('没有商品');
                err.status = 404;
                return next(err);
            }

            // Successful, so render.
            res.render('product-detail.html', { title: 'Product Detail', product:  results.product, prev: rlt.productPrev, next: rlt.productNext, catalogs: results.catalogs, });
        });
    });
}

// 联系我们
exports.page_contact_get = function (req, res, next) {
    res.render('contact.html', {
        url: 'contact',
        title: 'Contact Us',
        current: 'contact',
        navItem: [
            {subTitle: 'Contact', url: '/catalog/contact'},
            // {subTitle: '公司地图', url: '/catalog/map'}
        ]
    });
}

// 公司地图
exports.page_map_get = function (req, res, next) {
    res.render('map.html', {
        url: 'contact',
        title: '联系我们',
        current: 'map',
        navItem: [
            {subTitle: '联系方式', url: '/catalog/contact'},
            {subTitle: '公司地图', url: '/catalog/map'}
        ]
    });
}

exports.page_product_edit_get = function (req, res, next) {
    res.render('edit-product.html')
}

