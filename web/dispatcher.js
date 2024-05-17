"use strict";

const router = require("express").Router();

const index_controller = require("./index-controller");
const enrich = require("./enrich");
const generate = require("./generate");
const pass = require("./pass");

router.get("/", index_controller.index);
router.post("/generate", generate.generate);
router.post("/enrich", enrich.enrich);
router.post("/generateDataset", pass.generateDataset);

module.exports = router;
