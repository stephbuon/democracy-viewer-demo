const passport = require("passport");
const passportSaml = require("passport-saml");
const fs = require("fs");
const config = require("./config");

const savedUsers = [];

const test = fs.readFileSync(config.saml.cert);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// SAML Authentication
const strategy = new passportSaml.Strategy(
    {
        entryPoint: config.saml.entryPoint,
        issuer: config.saml.issuer,
        callbackUrl: config.saml.callback,
        cert: fs.readFileSync(config.saml.cert, "utf-8")
    },
    (user, done) => {
        if (!savedUsers.includes(user)) {
            savedUsers.push(user);
        }
        console.log(user)

        return done(null, user);
    }
);

passport.use(strategy);

module.exports = passport;