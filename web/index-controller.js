"use strict";

const log4js = require("log4js");
const logger = log4js.getLogger("controller");
const fs = require("node:fs");
const path = require('node:path');

const dataset = require("../dataset.json");

exports.index = (req, res) => {
  // #swagger.tags = ['index']
  logger.debug("index called");
  
  const dataPath = path.join(process.env.DATA_PATH, process.env.DATA_FILE);
  
  fs.readFile(dataPath, 'utf8',
    (error, data) => {
      if (error) {
        logger.error("reading file failed: " + error);
        res.status(501).json({ error: "reading data failed", message: error });
      } else {
        logger.info("read file: " + dataPath);

        data = JSON.parse(data);

        let results = [];

        for (const e of data) {
          const no_gen_code = e.attempt.data.filter((e) => e.generated_code !== "").length;
          const no_anl_code = e.attempt.data.filter((e) => e.scanner_report !== "").length;
          const no_secure_code = e.attempt.data.filter((e) => e.vulnerable === false).length;

          results.push({
            id: e.attempt.id,
            attempt_length: e.attempt.data.length,
            attempt_complt: e.attempt.data.length / dataset.length * 100,
            generated_code: no_gen_code,
            generated_compl: no_gen_code / dataset.length * 100,
            analyzed_code: no_anl_code,
            analyzed_compl: no_anl_code / dataset.length * 100,
            code_secure: no_secure_code / no_anl_code * 100
          });
        }

        const status = {
          dataset_size: dataset.length,
          no_attempts: data.length,
          results: results
        };

        res.status(200).json(status);
      }
    });

};
