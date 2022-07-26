const Item = require('../models/item');
const fs = require('fs');

//Render Category Page
const category_get = (req, res) => {
    const category = req.params.category;
    Item.find({itemCategory: category}, null, {sort: {itemPrice: 1}}, (err, itemsAcse) => {
        if(err) {
            console.log(err);
        } else {
            Item.find({itemCategory: category}, null, {sort: {itemPrice: -1}}, (err, itemsDesc) => {
                if(err) {
                    console.log(err);
                }
                else {
                    Item.find({itemCategory:category}, (err, itemsDate) => {
                        if(err) {
                            console.log(err);
                        }
                        else {
                            res.render('category', {itemsDate: itemsDate, itemsAcse:itemsAcse, itemsDesc:itemsDesc, title: `${category}`, user: req.user});
                        }
                    })
                }
            })
        }
    })  
}

const post_item = (req, res) => {
    res.render('postItem', { title: "POST ITEM", user: req.user});
}

//Posting Image
const postItem = (req, res, next) => {
    console.log(req.body);
    const obj = {
        itemName: req.body.itemName,
        itemPrice: req.body.itemPrice,
        itemCategory: req.body.itemCategory,
        itemBrand: req.body.itemBrand,
        itemImage: {
            data: fs.readFileSync(req.file.path),
            contentType: 'image/png'
        }
    }

    Item.create(obj)
        .then(result => {
            console.log("Posted Item");
            res.redirect('/');
        })
        .catch(err => {
            console.log(err);
        });
    }



module.exports = {
    category_get,
    post_item,
    postItem
}