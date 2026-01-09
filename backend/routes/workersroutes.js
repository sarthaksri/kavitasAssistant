const express = require("express");
const router = express.Router();

const { getFinLLM,
  getQualityLLM,
  getTargetLLM } = require("../controllers/workerscontroller");

// POST /workers
router.post("/finance", getFinLLM);
router.post("/quality", getQualityLLM);
router.post("/target", getTargetLLM);

module.exports = router;