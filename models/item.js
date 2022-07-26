const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    itemName: {
        type: String,
        required: true,
    },
    itemPrice: {
        type: Number,
        required: true,
    },
    itemCategory: {
        type:String,
        required: true,
    },
    itemBrand: {
        type: String,
        required: false,
    },
    itemImage: {
        data: Buffer,
        contentType: String
    }
}, {timestamps: true });

const Product = mongoose.model('Item', itemSchema);
module.exports = Product;