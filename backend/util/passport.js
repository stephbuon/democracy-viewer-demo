const passport = require("passport");
const passportSaml = require("passport-saml");
require("dotenv").config();

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// SAML Authentication
const strategy = new passportSaml.Strategy(
    {
        entryPoint: process.env.ENTRYPOINT,
        issuer: process.env.ISSUER,
        callbackUrl: process.env.CALLBACK,
        cert: process.env.CERT
    },
    (profile, done) => done(null, profile)
);

passport.use(strategy);

module.exports = strategy;