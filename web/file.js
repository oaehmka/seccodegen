"use strict";

const log4js = require("log4js");
const logger = log4js.getLogger("controller");
const fs = require("node:fs");
const path = require('node:path');

exports.write = (req, res) => {
  // #swagger.tags = ['file']
  logger.debug("write called");

  const baseDir = "output";
  const sanitizedPath = path.join(baseDir, path.join("/", req.body.filename));
  
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
