"use strict";

const router = require("express").Router();

const index_controller = require("./index-controller");

router.get("/", index_controller.index);
router.post("/generate", index_controller.generate);

module.exports = router;
