const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('./models/User');

module.exports = function(passport){
    var opts = {}
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = 'secret';
    //opts.issuer = 'accounts.examplesoft.com';
    //opts.audience = 'yoursite.net';

    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
        console.log(jwt_payload);
        User.getUserById({_id: jwt_payload._id}, function(err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
               // or you could create a new account
            }
        });
    }));

}


