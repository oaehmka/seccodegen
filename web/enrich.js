"use strict";

const log4js = require("log4js");
const logger = log4js.getLogger("controller");

const dataset = require("../dataset.json");

exports.enrich = (req, res) => {
  // #swagger.tags = ['enrich']
  logger.debug("enrichDataset called");

  const set = this.enrichDataset(req.body.prefix, req.body.suffix);

  res.status(200).json(set);
};

exports.enrichDataset = (prefix, suffix) => {
  const p = prefix ? prefix + " " : "";
  const s = suffix ? " " + suffix : "";

  const dataset_copy = dataset;

  dataset_copy.forEach((element) => {
    console.log(element.suspected_vulnerability);
    element.modified_prompt = (p + element.prompt + s)
      .replace("<cwe>", element.suspected_vulnerability)
      .replace("<language>", element.language);
  });

  return dataset_copy;
};
