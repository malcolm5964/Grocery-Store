const express = require('express');
const categoryController = require('../controllers/categoryController');
const multer = require('multer');
const router = express.Router();

//Multer for storing uploaded files
// SET STORAGE
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })
   
const upload = multer({ storage: storage })



//Render post item page
router.get('/postItem',checkAuthenticated, categoryController.post_item);
//Post Item
router.post('/item', upload.single('itemImage'), categoryController.postItem);

//Render Category Page
router.get('/:category', categoryController.category_get);


function checkAuthenticated(req, res, next) {
  if(req.isAuthenticated()) {
    return next()
  }
  res.redirect('/')
}


module.exports = router;