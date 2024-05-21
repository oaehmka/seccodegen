"use strict";

const router = require("express").Router();

const index_controller = require("./index-controller");
const enrich = require("./enrich");
const generate = require("./generate");
const evaluate = require("./evaluate");
const file = require("./file");
const scanner = require("./scanner");

router.get("/", index_controller.index);
router.post("/generate", generate.generate);
router.post("/enrich", enrich.enrich);
router.post("/writeFile", file.write);
router.post("/readFile", file.read);
router.post("/appendFile", file.append);
router.post("/scan", scanner.scan);
router.post("/addAttempt", evaluate.addAttempt);
router.get("/generateMissingCode", evaluate.generateMissingCode);
router.get("/analyzeMissingCode", evaluate.analyzeMissingCode);

module.exports = router;
