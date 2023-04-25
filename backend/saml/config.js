require("dotenv").config();

const config = {
    saml: {
        cert: process.env.CERT, // Get from SMU
        entryPoint: process.env.ENTRYPOINT,
        issuer: process.env.ISSUER,
        callback: process.env.CALLBACK,
        options: {
            failureRedirect: "/login",
            failureFlash: true
        }
    },
    server: {
        port: 8000
    },
    session: {
        resave: false,
        secret: process.env.SAML_SECRET,
        saveUninitialized: true
    }
}

module.exports = config;