"use strict";

const log4js = require("log4js");
const dotenv = require("dotenv-extended");
const express = require("express");
const bodyParser = require("body-parser");
const router = require("./web/dispatcher");
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger_output.json");

// Read the properties from file '.env' and '.env.defaults'
dotenv.load({ silent: true });

// Configure log4js based on the definitions in file 'log4js.json'
log4js.configure("log4js.json");
const logger = log4js.getLogger("app");

// Create the Express Server App
const app = express();

app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Configure body-parser. The parser handles the JSON payload.
app.use(bodyParser.json());

// Configure the dispatcher with all its controllers
const CONTEXT_PATH = process.env.CONTEXT_PATH || "/";
const PORT = process.env.PORT || 3000;

app.use(CONTEXT_PATH, router);
// Start the App as HTTP server
app.listen(PORT);

// Use backquotes for the es6 feature
logger.info(
  `Server started on port '${PORT}' with context-path '${CONTEXT_PATH}'`
);

module.exports = app;
