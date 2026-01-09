const express = require("express");
const router = express.Router();

const {
  getFinLLM,
  getQualityLLM,
  getTargetLLM
} = require("../controllers/workerscontroller");

const { getStateSummaryLLM } = require("../controllers/llmcontroller");

router.post("/finance", getFinLLM);
router.post("/quality", getQualityLLM);
router.post("/target", getTargetLLM);
router.post("/summary", getStateSummaryLLM);

module.exports = router;
