"use strict";

const log4js = require("log4js");
const logger = log4js.getLogger("controller");

exports.index = (req, res) => {
  // #swagger.tags = ['index']
  logger.debug("index called");
  res.status(200).json({
    Status: "Running",
  });
};

exports.generate = async (req, res) => {
  // #swagger.tags = ['index']
  logger.debug("generate called")
  logger.debug(req.body.prompt);

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    body: JSON.stringify({
      "model": "gpt-3.5-turbo",
      "messages": [{"role": "user", "content": req.body.prompt}],
      "temperature": 0.7
    }),
    headers: {
      "Content-type": "application/json; charset UTF-8;",
      "Authorization": "Bearer " + process.env.OPENAI_API_KEY
    }
  }).then((response) => response.json());

  res.status(201).json(response.choices[0].message.content);
}
