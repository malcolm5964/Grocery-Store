const express = require('express');
const accountController = require('../controllers/accountController');
const passport = require("passport");
const router = express.Router();
require('dotenv').config()


//Sign Up Routes
router.get('/signup', accountController.signup_get);
router.post('/signup', accountController.create_user)

//Login Routes
router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
    failureFlash: true
    })
);

//Logout Routes
router.get('/logout', accountController.account_logout);

module.exports = router;