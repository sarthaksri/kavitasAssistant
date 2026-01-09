const express = require("express");
const router = express.Router();

const { getFinLLM,
  getQualityLLM,
  getTargetLLM,
  getComplaintLLM } = require("../controllers/workerscontroller");

// POST /workers
router.post("/finance", getFinLLM);
router.post("/quality", getQualityLLM);
router.post("/target", getTargetLLM);
router.post("/complaint", getComplaintLLM);

module.exports = router;