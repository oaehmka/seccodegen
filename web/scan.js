"use strict";

const log4js = require("log4js");
const logger = log4js.getLogger("controller");

exports.scan = (req, res) => {
  // #swagger.tags = ['scan']
  logger.debug("generate called");

  const response = this.scanCode(req.body);

  res.status(200).json(response);
};

exports.scanCode = (body) => {
  const inputElements = ["code", "sus_cwe", "language"];

  if (!inputElements.every((element) => Object.hasOwn(body, element))) {
    logger.error("Input is missing elements.");
    logger.debug("Object: " + body);
    return { error: "Input is missing elements." };
  }

  // TODO scan code

  return {
    report: "the code may or may not be vulnerable",
    vulnerable: true
  };
};
