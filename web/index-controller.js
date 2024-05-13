"use strict";

const log4js = require("log4js");
const logger = log4js.getLogger("controller");

const dataset = require("../dataset.json");

exports.index = (req, res) => {
  // #swagger.tags = ['index']
  logger.debug("index called");
  res.status(200).json({
    Status: "Running",
  });
};

exports.generate = async (req, res) => {
  // #swagger.tags = ['index']
  logger.debug("generate called");

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: req.body.prompt }],
      temperature: 0.7,
    }),
    headers: {
      "Content-type": "application/json; charset UTF-8;",
      Authorization: "Bearer " + process.env.OPENAI_API_KEY,
    },
  }).then((response) => response.json());

  res.status(201).json(response.choices[0].message.content);
};

exports.enrich = async (req, res) => {
  // #swagger.tags = ['index']
  logger.debug("enrichDataset called");

  const set = enrichDataset(req.body.prefix, req.body.suffix);

  res.status(200).json(set);
};

function enrichDataset(prefix, suffix) {
  const p = prefix ? prefix + " " : "";
  const s = suffix ? " " + suffix : "";

  const dataset_copy = JSON.parse(JSON.stringify(dataset));

  dataset_copy.forEach((element) => {
    element.prompt = p + element.prompt + s;
  });

  return dataset_copy
}

exports.generateDataset = async (req, res) => {
  // #swagger.tags = ['index']
  logger.debug("generateDataset called");

  const set = enrichDataset(req.body.prefix, req.body.suffix);

  // TODO: generate code for each prompt
  set.forEach((el) => console.log(el));

  res.status(200).json(set);
};
