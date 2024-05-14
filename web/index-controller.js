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

  const response = { code: await generateCode(req.body.prompt) };

  res.status(201).json(response);
};

async function generateCode(prompt) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    }),
    headers: {
      "Content-type": "application/json; charset UTF-8;",
      Authorization: "Bearer " + process.env.OPENAI_API_KEY,
    },
  }).then((r) => r.json());

  return await response.choices[0].message.content;
}

exports.enrich = (req, res) => {
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

  return dataset_copy;
}

exports.generateDataset = async (req, res) => {
  // #swagger.tags = ['index']
  logger.debug("generateDataset called");

  const prompts = enrichDataset(req.body.prefix, req.body.suffix);

  let re = [];
  await Promise.all(
    prompts.map(async (element) => {
      re.push({ code: await generateCode(element.prompt) });
    })
  );

  res.status(200).json(re);
};
