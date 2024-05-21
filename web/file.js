"use strict";

const log4js = require("log4js");
const logger = log4js.getLogger("controller");
const fs = require("node:fs");
const path = require('node:path');

exports.write = (req, res) => {
  // #swagger.tags = ['file']
  logger.debug("write called");

  const baseDir = process.env.DATA_PATH;
  const sanitizedPath = path.join(baseDir, path.join("/", req.body.filename));
  
  // TODO create directory if necessary, else writing is going to fail

  fs.writeFile(sanitizedPath, req.body.content,
    (error) => {
      if (error) {
        logger.error("writing file failed: " + error);
        res.status(501).json({ error: "writing failed", message: error })
      } else {
        logger.info("write to file: " + req.body.filename);
        res.status(201).json({
          status: "File written successfully",
        });
      }
    });
};

exports.read = (req, res) => {
  // #swagger.tags = ['file']
  logger.debug("read called");

  const baseDir = process.env.DATA_PATH;
  const sanitizedPath = path.join(baseDir, path.join("/", req.body.filename));
  
  fs.readFile(sanitizedPath, 'utf8',
    (error, data) => {
      if (error) {
        logger.error("reading file failed: " + error);
        res.status(501).json({ error: "reading failed", message: error })
      } else {
        logger.info("read file: " + req.body.filename);
        res.status(200).type('json').send(data);
      }
    });
};
