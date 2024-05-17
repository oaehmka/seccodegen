"use strict";

const log4js = require("log4js");
const logger = log4js.getLogger("controller");

exports.generate = async (req, res) => {
  // #swagger.tags = ['generate']
  logger.debug("generate called");

  const response = { code: await this.generateCode(req.body.prompt) };

  res.status(200).json(response);
};

exports.generateCode = async (prompt) => {
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

  if (Object.hasOwn(response, 'error')) {
    logger.error("Generating Code failed: " + response.error.message);
    return "no code generated";
  }

  try {
    return response.choices[0].message.content;
  } catch (error) {
    logger.error("No message content available: " + error);
    return response;
  }
}
