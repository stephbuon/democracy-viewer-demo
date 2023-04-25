const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const expressSession = require("express-session");
const passport = require("passport");
const samlConfig = require("./saml/config");
require("./saml/passport");

// Import middleware
const requestLog = require("./middleware/logging");
const { createModelsMiddleware, disconnectFromDatababaseMiddleware } = require("./middleware/models");

// Import routes
const datasets = require("./routes/datasets");
const graphs = require("./routes/graphs");
const groups = require("./routes/groups");
const preprocessing = require("./routes/preprocessing");
const saml = require("./routes/saml");
const session = require("./routes/session");
const users = require('./routes/users');

const app = express();
const port = 8000;

// Use middleware
app.use(cors());
app.use(createModelsMiddleware);
app.use(requestLog);
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000} ));
app.use(passport.initialize());
app.use(passport.session());
// SAML
app.use(expressSession(samlConfig.session));
app.use(passport.initialize());
app.use(passport.session());

// API rules
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", "true");
    next();
})

// Testing health route
app.get("/health", (req, res, next) => {
    const result = {status: "up", port};
    res.json(result);
    next();
});

// Use routes
app.use("/datasets", datasets);
app.use("/graphs", graphs);
app.use("/groups", groups);
app.use("/preprocessing", preprocessing);
app.use("/saml", saml);
app.use("/session", session);
app.use("/users", users);

app.listen(port, () => {
    console.log(`This app is listening on port ${ port }`);
});