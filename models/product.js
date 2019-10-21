const mongoose = require('mongoose');
const moment = require('moment');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    p_name: {type: String, required: true, min: 3, max: 100},
    p_summary: {type: String, required: true, min: 3, max: 100},
    p_catalog: {type: String, required: true},
    p_num: {type: String, required: true},
    p_cover: {type: String},
    created_date: {type: Date},
    update_date: {type: Date}
});

ProductSchema.virtual('url').get(function () {
    return '/catalog/products/' + this._id;
})

// 如果需要获取 创建时间 ,需要将时区+8
ProductSchema.virtual('created').get(function () {
    return moment(this.created_date).utcOffset(8).format('YYYY-MM-DD HH:mm:ss')
});

// 如果需要获取 更新时间 ,需要将时区+8
ProductSchema.virtual('update').get(function () {
    return moment(this.update_date).utcOffset(8).format('YYYY-MM-DD HH:mm:ss')
});

module.exports = mongoose.model('Product', ProductSchema);

