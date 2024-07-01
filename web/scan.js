"use strict";

const log4js = require("log4js");
const fs = require("node:fs");
const logger = log4js.getLogger("controller");
const path = require("path");
const {execSync} = require("child_process");

exports.scan = (req, res) => {
    // #swagger.tags = ['scan']
    logger.debug("generate called:", req.body.id, req.body.language, req.body.suspected_vulnerability, req.body.extracted_code);

    const response = this.scanSemgrep(req.body);

    res.status(200).json(response);
};

exports.scanSemgrep = (body) => {
    const inputElements = ["extracted_code", "id", "suspected_vulnerability", "language"];

    if (!inputElements.every((element) => Object.hasOwn(body, element))) {
        logger.error("Input is missing element");
        logger.debug("Object: " + body);
        return {error: "Input is missing elements."};
    }

    // create temporary directory
    const directoryName = Math.random().toString(36).substring(7);
    const directoryPath = path.join('tmp', 'scan', directoryName);

    // write code to file
    let extension = body.language.replace("python", "py");
    const fileName = body.id + "." + extension;
    const filePath = path.join(directoryPath, fileName);

    fs.mkdirSync(directoryPath, {recursive: true});
    fs.writeFileSync(filePath, body['extracted_code'], (error) => {
        if (error) {
            logger.error("writing file failed: " + error);
            res.status(501).json({error: "writing failed", message: error});
        } else {
            logger.info("write to file: " + req.body.filename);
        }
    });

    // executing semgrep
    const databaseCreateCommand = `semgrep scan --json -q --no-git-ignore`;
    let scanResult;
    try {
        logger.debug("executing semgrep scan")
        const output = execSync(databaseCreateCommand, {cwd: directoryPath});
        scanResult = JSON.parse(output.toString());
    } catch (error) {
        logger.error("Error executing command:", error.message);
        logger.error("stderr:", error.stderr ? error.stderr.toString() : "No stderr");
    }

    // deleting temporary folder
    fs.rmSync(directoryPath, { recursive: true, force: true });

    return {
        report: JSON.stringify(scanResult),
        vulnerable: scanResult.results.length > 0
    }
}

exports.scanCodeQL = (body) => {
    const inputElements = ["extracted_code", "id", "suspected_vulnerability", "language"];

    if (!inputElements.every((element) => Object.hasOwn(body, element))) {
        logger.error("Input is missing elements.");
        logger.debug("Object: " + body);
        return {error: "Input is missing elements."};
    }

    // create temporary directory
    const directoryName = Math.random().toString(36).substring(7);
    const directoryPath = path.join('tmp', 'scan', directoryName);

    // write code to file
    let extension = body.language.replace("python", "py");
    const fileName = body.id + "." + extension;
    const filePath = path.join(directoryPath, fileName);

    fs.mkdirSync(directoryPath, {recursive: true});
    fs.writeFileSync(filePath, body['extracted_code'], (error) => {
        if (error) {
            logger.error("writing file failed: " + error);
            res.status(501).json({error: "writing failed", message: error});
        } else {
            logger.info("write to file: " + req.body.filename);
        }
    });

    const databasePath = path.join(directoryPath, "codeql-database");
    const resultsPath = path.join(directoryPath, "codeql-results.csv");


    // execute codeql command
    const {execSync} = require("child_process");
    const databaseCreateCommand = `codeql database create --language=${body.language.replace("C", "cpp")} --source-root="${directoryPath}" ${databasePath}`;
    try {
        console.log("executing codeql database create")
        const output = execSync(databaseCreateCommand, {stdio: 'inherit'});
        console.log(output);
    } catch (error) {
        console.error("Error executing command:", error.message);
        console.error("stderr:", error.stderr ? error.stderr.toString() : "No stderr");
    }

    const databaseScanCommand = `codeql database analyze ${databasePath} --format=csv --output=${resultsPath}`;
    try {
        console.log("executing codeql database analyze")
        const output = execSync(databaseScanCommand, {stdio: 'inherit'});
        console.log(output);
    } catch (error) {
        console.error("Error executing command:", error.message);
        console.error("stderr:", error.stderr ? error.stderr.toString() : "No stderr");
    }


    let vulnerable = false;
    let errors = []
    const resultCsv = fs.readFileSync(
        path.join(resultsPath),
        "utf8"
    );
    if (resultCsv.length > 0) {
        const rows = resultCsv.split("\n");

        errors = rows.filter(row => {
            const columns = row.split(',');
            return columns[2]?.includes("error");
        });


        if (errors.length > 0) {
            vulnerable = true;
        }

    }

    return {
        report: errors.join("\n"),
        vulnerable: vulnerable
    }
};
