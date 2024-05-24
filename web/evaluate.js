"use strict";

const log4js = require("log4js");
const logger = log4js.getLogger("controller");
const fs = require("node:fs");
const path = require("node:path");

const enrich = require("./enrich");
const generate = require("./generate");
const scanner = require("./scanner");

exports.addAttempt = (req, res) => {
  // #swagger.tags = ['evaluate']
  logger.debug("addAttempt called");

  const prompts = enrich.enrichDataset(req.body.prefix, req.body.suffix);

  const dataPath = path.join(
    process.env.DATA_PATH,
    path.join("/", req.body.id + ".json")
  );

  let attempt = {
    attempt: {
      id: req.body.id,
      description: req.body.description,
      data: [],
      secure: -1,
    },
  };

  for (const e of prompts) {
    attempt.attempt.data.push({
      original_prompt: e.prompt,
      modified_prompt: e.modified_prompt,
      suspected_vulnerability: e.suspected_vulnerability,
      generated_code: "",
      language: e.language,
      vulnerable: null,
      scanner_report: "",
    });
  }

  const no_overwrite = { flag: "wx" };
  fs.writeFile(dataPath, JSON.stringify(attempt, null, 2), no_overwrite, (error) => {
    if (error) {
      logger.error("writing file failed: " + error);
      res.status(501).json({ error: "writing failed", message: error });
    } else {
      logger.info("write to file: " + req.body.id + ".json");
      res.status(201).send();
    }
  });
};

exports.generateMissingCode = (req, res) => {
  // #swagger.tags = ['evaluate']
  logger.debug("generateMissingCode called");

  // TODO instead of just processing "DATA_FILE" process every json in the "DATA_PATH"" folder
  const dataPath = path.join(process.env.DATA_PATH, process.env.DATA_FILE);

  fs.readFile(dataPath, "utf8", async (error, data) => {
    if (error) {
      logger.error("reading file failed: " + error);
      res.status(501).json({ error: "reading data failed", message: error });
    } else {
      logger.info("read file: " + dataPath);

      data = JSON.parse(data);

      for (const e of data) {
        for (const datapoint of e.attempt.data) {
          if (datapoint.generated_code === "") {
            logger.info("generating code");

            await generate
              .generateCode(datapoint.modified_prompt)
              .then((el) => {
                datapoint.generated_code = el;
              });
          }
        }
      }

      fs.writeFile(dataPath, JSON.stringify(data, null, 2), (error) => {
        if (error) {
          logger.error("writing file failed: " + error);
          res.status(501).json({ error: "writing failed", message: error });
        } else {
          logger.info("write to file: " + dataPath);
          res.status(201).send();
        }
      });
    }
  });
};

exports.analyzeMissingCode = (req, res) => {
  // #swagger.tags = ['evaluate']
  logger.debug("analyzeMissingCode called");

  // TODO instead of just processing "DATA_FILE" process every json in the "DATA_PATH"" folder
  const dataPath = path.join(process.env.DATA_PATH, process.env.DATA_FILE);

  fs.readFile(dataPath, "utf8", async (error, attempts) => {
    if (error) {
      logger.error("reading file failed: " + error);
      res.status(501).json({ error: "reading data failed", message: error });
    } else {
      logger.info("read file: " + dataPath);

      attempts = JSON.parse(attempts);

      for (const a of attempts) {
        let number_of_secure_results = 0;
        for (const d of a.attempt.data) {
          if (d.vulnerable === true) {
            number_of_secure_results += 1;
          }
          if (d.scanner_report === "" && d.generated_code !== "") {
            logger.info("scanning code");

            const scan_result = scanner.scanCode({
              code: d.generated_code,
              sus_cwe: d.suspected_vulnerability,
              language: d.language,
            });
            d.scanner_report = scan_result.report;
            d.vulnerable = scan_result.vulnerable;
          }
        }
        if (a.attempt.secure === -1) {
          a.attempt.secure =
            (number_of_secure_results / a.attempt.data.length) * 100;
        }
      }

      fs.writeFile(dataPath, JSON.stringify(attempts, null, 2), (error) => {
        if (error) {
          logger.error("writing file failed: " + error);
          res.status(501).json({ error: "writing failed", message: error });
        } else {
          logger.info("write to file: " + dataPath);
          res.status(201).send();
        }
      });
    }
  });
};
