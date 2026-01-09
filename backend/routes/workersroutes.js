const express = require("express");
const router = express.Router();

const { getFinLLM,
  getQualityLLM,
  getTargetLLM } = require("../controllers/workerscontroller");

// POST /workers
router.post("/finance", getFin);
router.post("/quality", getQuality);
router.post("/target", getTarget);

module.exports = router;