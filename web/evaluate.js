"use strict";

const log4js = require("log4js");
const logger = log4js.getLogger("controller");
const fs = require("node:fs");
const path = require("node:path");

const enrich = require("./enrich");
const generate = require("./generate");
const scan = require("./scan");

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

  fs.mkdirSync(process.env.DATA_PATH, { recursive: true });

  const no_overwrite = { flag: "wx" };
  fs.writeFile(
    dataPath,
    JSON.stringify([attempt], null, 2),
    no_overwrite,
    (error) => {
      if (error) {
        logger.error("writing file failed: " + error);
        res.status(501).json({ error: "writing failed", message: error });
      } else {
        logger.info("write to file: " + req.body.id + ".json");
        res.status(201).send();
      }
    }
  );
};

exports.generateMissingCode = (req, res) => {
  // #swagger.tags = ['evaluate']
  logger.debug("generateMissingCode called");

  const ls = fs.readdirSync(process.env.DATA_PATH);

  const all_promises = [];

  ls.forEach(async (file) => {
    const content = fs.readFileSync(
      path.join(process.env.DATA_PATH, file),
      "utf8"
    );
    const attempts = JSON.parse(content);

    if (Array.isArray(attempts)) {
      const promises_per_file = [];

      for (const attempt of attempts) {
        for (const data of attempt.attempt.data) {
          if (data.generated_code === "") {
            logger.info("generating code");
            const promise = generate
              .generateCode(data.modified_prompt)
              .then((el) => {
                data.generated_code = el;
              });
            all_promises.push(promise);
            promises_per_file.push(promise);
          }
        }
      }

      Promise.all(promises_per_file).then(() =>
        fs.writeFileSync(
          path.join(process.env.DATA_PATH, file),
          JSON.stringify(attempts, null, 2)
        )
      );
    }
  });

  Promise.all(all_promises).then(() => res.status(201).send());
};

exports.analyzeMissingCode = (req, res) => {
  // #swagger.tags = ['evaluate']
  logger.debug("analyzeMissingCode called");

  const ls = fs.readdirSync(process.env.DATA_PATH);

  ls.forEach(async (file) => {
    const content = fs.readFileSync(
      path.join(process.env.DATA_PATH, file),
      "utf8"
    );
    const attempts = JSON.parse(content);

    let number_of_secure_results = 0;

    if (Array.isArray(attempts)) {
      for (const attempt of attempts) {
        for (const data of attempt.attempt.data) {
          if (data.scanner_report === "" && data.generated_code !== "") {
            logger.info("scanning code");

            const scan_result = scan.scanCode({
              code: data.generated_code,
              sus_cwe: data.suspected_vulnerability,
              language: data.language,
            });

            data.scanner_report = scan_result.report;
            data.vulnerable = scan_result.vulnerable;
          }
          if (data.vulnerable === true) {
            number_of_secure_results += 1;
          }
        }
        if (attempt.attempt.secure === -1) {
          attempt.attempt.secure =
            (number_of_secure_results / attempt.attempt.data.length) * 100;
        }
      }
      fs.writeFileSync(
        path.join(process.env.DATA_PATH, file),
        JSON.stringify(attempts, null, 2)
      );
    }
  });
  res.status(201).send();
};
