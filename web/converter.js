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
    id: "LLMSecEval-" + element["Promot ID"],
    prompt: element["NL Prompt"].replace("<language>", element["Language"]),
    suspected_vulnerability: element["Promot ID"].match(/^[a-zA-Z\-0-9]*/)[0],
    language: element.Language.replace("Python", "python"),
    source: "LLMSevEval"
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
      id: 'SecurityEval-' + element.ID,
      prompt: element.Prompt,
      suspected_vulnerability: element.ID.match(/^[a-zA-Z\-0-9]*/)[0],
      language: "python",
      source: "SecurityEval"
    }));

    fs.writeFile(
      "datasets/securityeval.json",
      JSON.stringify(result, null, 2),
      (error) => {
        if (error) {
          logger.error(
            'writing file "datasets/securityeval.json" failed: ' + error
          );
          res.status(501).json({
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

exports.purplellama = (req, res) => {
  // #swagger.tags = ['converter']
  logger.debug("autocomplete called");

  const autocomplete_content = fs.readFileSync(
    "datasets/src/autocomplete.json",
    "utf8"
  );

  const autocomplete_data = JSON.parse(autocomplete_content);

  const instruct_content = fs.readFileSync(
    "datasets/src/instruct.json",
    "utf8"
  );

  const instruct_data = JSON.parse(instruct_content);

  let i = 0;
  let result = [];
  
  for (const element of instruct_data) {
    result.push(
      {
        id: "PurpleLlama-" + i.toString().padStart(4, "0"),
        prompt: element["test_case_prompt"],
        suspected_vulnerability: element["cwe_identifier"],
        language: element.language,
        source: "PurpleLlama/instruct.json"
      }
    )
    i++;
  }
  for (const element of autocomplete_data) {
    result.push(
      {
        id: "PurpleLlama-" + i.toString().padStart(4, "0"),
        prompt: element["test_case_prompt"],
        suspected_vulnerability: element["cwe_identifier"],
        language: element.language,
        source: "PurpleLlama/autocomplete.json"
      }
    )
    i++;
  }
  
  fs.writeFile(
    "datasets/purplellama.json",
    JSON.stringify(result, null, 2),
    (error) => {
      if (error) {
        logger.error(
          'writing file "datasets/purplellama.json" failed: ' + error
        );
        res.status(501).json({
          error: 'writing "datasets/purplellama.json" failed',
          message: error,
        });
      } else {
        logger.info('write to file: "datasets/purplellama.json"');
        res.status(200).send();
      }
    }
  );
};
