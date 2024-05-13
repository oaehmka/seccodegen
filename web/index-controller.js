"use strict";

const log4js = require("log4js");
const logger = log4js.getLogger("controller");

exports.index = (req, res) => {
  // #swagger.tags = ['index']
  logger.debug("index called");
  res.status(200).json({
    Status: "Running",
  });
};
