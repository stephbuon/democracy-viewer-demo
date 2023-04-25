const express = require("express");
const router = express.Router();

const passport = require("passport");
const config = require("../saml/config");

router.get("/", (req, res, next) => {
    if (!req.isAuthenticated()) {
        console.error("SAML authentication failed");
        res.status(401).json({ message: "SAML authentication failed" });
    } else {
        console.log(req.user);

        res.status(200).json({ user: req.user });
    }

    next();
});

router.get("/login", passport.authenticate("saml", config.saml.options), (req, res, next) => {
    res.redirect("http://localhost:3000");

    next();
});

router.post("/login/callback", passport.authenticate("saml", config.saml.options), (req, res, next) => {
    res.redirect("http://localhost:3000");

    next();
});

module.exports = router;