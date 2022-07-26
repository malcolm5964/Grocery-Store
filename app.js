const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
require('dotenv').config({path: path.join(__dirname, '.env'), debug:true})

//For Route
const Item = require('./models/item');
const categoryRoutes = require('./routes/categoryRoutes');
const accountRoutes = require('./routes/accountRoutes');

const initializePassport = require('./passport-config');
initializePassport(passport)

const app = express();

//connect to mongoDB
const dbURI = `mongodb+srv://${process.env.DBUSERNAME}:${process.env.DBPASSWORD}@cluster0.2ncpgiw.mongodb.net/creditBlogs`;
//const dbURI = process.env.MONGODB_URI;

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {console.log("MongoDB Connected")})
  .catch(err => console.log(err))

app.set('view engine', 'ejs');

//static files
app.use(express.static('public'));
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')))

//Middleware
app.use(express.urlencoded({ extended: false }));

//Authentication Middleware
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())


//Routes
//Home Page Route
app.get('/', (req, res) => {
  Item.find({itemCategory: 'Beverage'}, null, {limit: 5}, (err, beverages) => {
    if(err) {
      console.log(err);
    }
    else {
      Item.find({itemCategory: 'Fruits'}, null, {limit: 5}, (err, fruits) => {
        if(err) {
          console.log(err);
        } else {
          Item.find({itemCategory: 'Meat'}, null, {limit: 5}, (err, meats) => {
            if(err) {
              console.log(err);
            } else {
              res.render('index', {beverages: beverages, fruits: fruits, meats: meats, title: "Malcolm Mart", user: req.user, message: req.flash('message')});
            }
            }) 
          }
      })
    }
  })
});


app.get('/contact', (req, res) => {
  res.render('contact', {title: "Contact", user: req.user});
})

app.get('/checkout', checkAuthenticated, (req, res) => {
  res.render('checkout', {title: "Checkout", user: req.user});
})

//Categroy Route
app.use('/category', categoryRoutes);

//Account Route
app.use('/account', accountRoutes);



function checkAuthenticated(req, res, next) {
  if(req.isAuthenticated()) {
    return next()
  }
  res.redirect('/')
}


app.listen(process.env.PORT || 5000, () => {console.log("Go to http://localhost:5000/")})