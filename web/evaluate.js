"use strict";

const log4js = require("log4js");
const logger = log4js.getLogger("controller");

const enrich = require("./enrich");
const generate = require("./generate");

exports.benchmark = async (req, res) => {
  // #swagger.tags = ['evaluate']
  logger.debug("benchmark called");

  const prompts = enrich.enrichDataset(req.body.prefix, req.body.suffix);

  let re = [];
  await Promise.all(
    prompts.map(async (element) => {
      re.push({
        prompt: element.prompt,
        code: await generate.generateCode(element.prompt),
      });
    })
  );

  res.status(200).json(re);
};
