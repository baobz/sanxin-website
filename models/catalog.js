const mongoose = require('mongoose');
const moment = require('moment');
const Schema = mongoose.Schema;

const CatalogSchema = new Schema({
    catalog: {type: String, required: true, min: 3, max: 100},
    c_code: {type: String, required: true}
});

CatalogSchema.virtual('url').get(function() {
    return `catalog/products/${this._id}`
})

module.exports = mongoose.model('Catalog', CatalogSchema);

