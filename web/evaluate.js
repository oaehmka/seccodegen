"use strict";

const log4js = require("log4js");
const logger = log4js.getLogger("controller");
const fs = require("node:fs");
const path = require('node:path');

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

exports.addAttempt = async (req, res) => {
  // #swagger.tags = ['evaluate']
  logger.debug("addAttempt called");

  const prompts = enrich.enrichDataset(req.body.prefix, req.body.suffix);

  const dataPath = path.join(process.env.DATA_PATH, process.env.DATA_FILE);
  
  fs.readFile(dataPath, 'utf8',
    (error, data) => {
      if (error) {
        logger.error("reading file failed: " + error);
        res.status(501).json({ error: "reading data failed", message: error });
      } else {
        logger.info("read file: " + dataPath);

        data = JSON.parse(data);

        let attempt = {
            attempt: {
              id: data.length,
              prefix: req.body.prefix,
              suffix: req.body.suffix,
              data: []
            }
          };

        for (const e of prompts) {
          attempt.attempt.data.push({
            original_prompt: e.prompt,
            modified_prompt: e.modified_prompt,
            suspected_vulnerability: e.suspected_vulnerability,
            generated_code: "",
            language: e.language,
            vulnerable: null,
            scanner_report: ""
          })
        }

        data.push(attempt);

        fs.writeFile(dataPath, JSON.stringify(data, null, 2),
        (error) => {
          if (error) {
            logger.error("writing file failed: " + error);
            res.status(501).json({ error: "writing failed", message: error })
          } else {
            logger.info("write to file: " + req.body.filename);
            res.status(201).send();
          }
        });

      }
    });

};
