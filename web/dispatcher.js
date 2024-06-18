"use strict";

const router = require("express").Router();

const index_controller = require("./index-controller");
const enrich = require("./enrich");
const generate = require("./generate");
const evaluate = require("./evaluate");
const file = require("./file");
const clear = require("./clear");
const scan = require("./scan");
const converter = require("./converter");

router.get("/", index_controller.index);
router.post("/generate", generate.generate);
router.post("/enrich", enrich.enrich);
router.post("/writeFile", file.write);
router.post("/readFile", file.read);
router.post("/appendFile", file.append);
router.post("/scan", scan.scan);
router.post("/addAttempt", evaluate.addAttempt);
router.get("/generateMissingCode", evaluate.generateMissingCode);
router.get("/extractMissingCode", evaluate.extractMissingCode);
router.get("/clearGeneratedCode", clear.clearGeneratedCode);
router.get("/clearExtractedCode", clear.clearExtractedCode);
router.get("/analyzeMissingCode", evaluate.analyzeMissingCode);
router.get("/LLMSecEvalConverter", converter.llmseceval);
router.get("/SecurityEvalConverter", converter.securityeval);
router.get("/PurpleLlamaConverter", converter.purplellama);

module.exports = router;
