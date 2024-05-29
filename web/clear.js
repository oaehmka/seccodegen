"use strict";

const log4js = require("log4js");
const logger = log4js.getLogger("controller");
const fs = require("node:fs");
const path = require("node:path");

const enrich = require("./enrich");
const generate = require("./generate");
const scan = require("./scan");

exports.clearGeneratedCode = (req, res) => {
    // #swagger.tags = ['clear']
    logger.debug("clearGeneratedCode called");


    const content = fs.readFileSync(
        path.join(process.env.DATA_FILE),
        "utf8"
    );
    const attempts = JSON.parse(content);
    if (Array.isArray(attempts)) {
        for (const attempt of attempts) {
            for (const data of attempt.attempt.data) {
                data.generated_code = "";
            }
            JSON.stringify(attempts, null, 2)
            fs.writeFileSync(
                path.join(process.env.DATA_FILE),
                JSON.stringify(attempts, null, 2)
            )
        }
    }
    return res.status(201).send();

}
exports.clearExtractedCode = (req, res) => {
    // #swagger.tags = ['clear']
    logger.debug("clearExtractedCode called");

    const content = fs.readFileSync(
        path.join(process.env.DATA_FILE),
        "utf8"
    );

    const attempts = JSON.parse(content);
    if (Array.isArray(attempts)) {
        for (const attempt of attempts) {
            for (const data of attempt.attempt.data) {
                data.extracted_code = "";
            }
        }
        fs.writeFileSync(
            path.join(process.env.DATA_FILE),
            JSON.stringify(attempts, null, 2)
        )
    }
    return res.status(201).send();
}
