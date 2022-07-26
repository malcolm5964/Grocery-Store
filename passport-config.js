const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs');
const Account = require('./models/account');

function initialize(passport) {
    const authenticateUser = (username, password, done) => {
        Account.findOne({ username: username}, (err, user) => {
            if (err) {
              return done(err);
            }
            if (!user) {
              return done(null, false, {message: "Incorrect Username"});
            }
            bcrypt.compare(password, user.password, (err, res) => {
              if(res) {
                //password match
                return done(null, user)
              } else {
                //password not match
                return done (null, false, { message: "Incorrect password"})
              }
            });
          });
    }
    passport.use(new LocalStrategy(authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        Account.findById(id, (err, user) => {
            done(err, user);
        });
    });
}

module.exports = initialize