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

        const status = {
          no_attempts: data.length,
          dataset_size: dataset.length
        };

        res.status(200).json(status);
      }
    });

};
