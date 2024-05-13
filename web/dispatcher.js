"use strict";

const router = require("express").Router();

const index_controller = require("./index-controller");

router.get("/", index_controller.index);

module.exports = router;
