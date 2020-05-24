const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const HotsController = require('../controllers/hots');

router.get("/", checkAuth, HotsController.hots_get_all);

router.post("/", checkAuth, HotsController.hots_create_hot);

router.get("/:hotId", checkAuth, HotsController.hots_get_hot);

router.delete("/:hotId", checkAuth, HotsController.hots_delete_hot);

module.exports = router;