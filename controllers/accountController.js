const Account = require('../models/account');
const bcrypt = require('bcryptjs');

//Render SignUp Page
const signup_get = (req, res) => {
    res.render('signup', {title: 'Sign Up'})
}

//Create New User
const create_user = (req, res) => {
    console.log(req.body);
    const account = new Account(req.body)
    bcrypt.hash(account.password, 10, (err, hashPassword) => {
        if(err) {
            console.log(err);
        }
        else {
                account.password = hashPassword;
                account.save()
                .then(result => {
                    res.redirect("/");
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }) 
}

const account_logout = (req, res) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        res.redirect("/");
    });
}

module.exports = {
    signup_get,
    create_user,
    account_logout
}