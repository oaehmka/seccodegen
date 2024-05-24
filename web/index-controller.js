"use strict";

const log4js = require("log4js");
const logger = log4js.getLogger("controller");
const fs = require("node:fs");
const path = require("node:path");

const dataset = require("../dataset.json");

exports.index = (req, res) => {
  // #swagger.tags = ['index']
  logger.debug("index called");

  const ls = fs.readdirSync(process.env.DATA_PATH);

  let results = [];
  let no_attempts = 0;


  ls.forEach((file) => {
    const content = fs.readFileSync(path.join(process.env.DATA_PATH, file), "utf8");
    const attempts = JSON.parse(content);
    if (Array.isArray(attempts)) {
      no_attempts += attempts.length;

      for (const attempt of attempts) {
        const no_gen_code = attempt.attempt.data.filter(
          (a) => a.generated_code !== ""
        ).length;
        const no_anl_code = attempt.attempt.data.filter(
          (a) => a.scanner_report !== ""
        ).length;
        const no_secure_code = attempt.attempt.data.filter(
          (a) => a.vulnerable === false
        ).length;

        results.push({
          id: attempt.attempt.id,
          attempt_length: attempt.attempt.data.length,
          attempt_complete: (attempt.attempt.data.length / dataset.length) * 100,
          generated_code: no_gen_code,
          generated_complete: (no_gen_code / dataset.length) * 100,
          analyzed_code: no_anl_code,
          analyzed_complete: (no_anl_code / dataset.length) * 100,
          code_secure: (no_secure_code / no_anl_code) * 100,
        });
      }
    }
  });

  const status = {
    dataset_size: dataset.length,
    no_attempts: no_attempts,
    results: results,
  };

  res.status(200).json(status);
};
