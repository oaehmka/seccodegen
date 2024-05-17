"use strict";

const router = require("express").Router();

const index_controller = require("./index-controller");
const enrich = require("./enrich");
const generate = require("./generate");
const evaluate = require("./evaluate");
const file = require("./file");

router.get("/", index_controller.index);
router.post("/generate", generate.generate);
router.post("/enrich", enrich.enrich);
router.post("/benchmark", evaluate.benchmark);
router.post("/writeFile", file.write);

module.exports = router;
