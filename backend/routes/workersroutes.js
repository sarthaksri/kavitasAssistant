const express = require("express");
const router = express.Router();

const { getFin,
  getQuality,
  getTarget } = require("../controllers/workerscontroller");

// POST /workers
router.post("/finance", getFin);
router.post("/quality", getQuality);
router.post("/target", getTarget);

module.exports = router;