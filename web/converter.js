"use strict";

const log4js = require("log4js");
const logger = log4js.getLogger("controller");
const fs = require("node:fs");
const readline = require("readline");

exports.llmseceval = (req, res) => {
  // #swagger.tags = ['converter']
  logger.debug("llmseceval called");

  const content = fs.readFileSync(
    "datasets/src/LLMSecEval-prompts.json",
    "utf8"
  );

  const data = JSON.parse(content);

  const result = data.map((element) => ({
    prompt: element["NL Prompt"],
    suspected_vulnerability: element["Promot ID"].match(/^[a-zA-Z\-0-9]*/)[0],
    language: element.Language,
  }));

  fs.writeFile(
    "datasets/llmseceval.json",
    JSON.stringify(result, null, 2),
    (error) => {
      if (error) {
        logger.error(
          'writing file "datasets/llmseceval.json" failed: ' + error
        );
        res.status(501).json({
          error: 'writing "datasets/llmseceval.json" failed',
          message: error,
        });
      } else {
        logger.info('write to file: "datasets/llmseceval.json"');
        res.status(200).send();
      }
    }
  );
};

exports.securityeval = (req, res) => {
  // #swagger.tags = ['converter']
  logger.debug("securityeval called");

  const rl = readline.createInterface({
    input: fs.createReadStream("datasets/src/SecurityEval-dataset.jsonl"),
    crlfDelay: Infinity,
  });

  const dataset = [];

  rl.on("line", (line) => {
    dataset.push(JSON.parse(line));
  });

  rl.on("close", () => {
    const result = dataset.map((element) => ({
      prompt: element.Prompt,
      suspected_vulnerability: element.ID.match(/^[a-zA-Z\-0-9]*/)[0],
      language: "python",
    }));

    fs.writeFile(
      "datasets/securityeval.json",
      JSON.stringify(result, null, 2),
      (error) => {
        if (error) {
          logger.error(
            'writing file "datasets/securityeval.json" failed: ' + error
          );
          res
            .status(501)
            .json({
              error: 'writing "datasets/securityeval.json" failed',
              message: error,
            });
        } else {
          logger.info('write to file: "datasets/securityeval.json"');
          res.status(200).send();
        }
      }
    );

  });

};
