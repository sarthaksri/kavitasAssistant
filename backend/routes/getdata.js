const express = require("express");
const router = express.Router();

const { 
  getStateDashboardData,
  getDetailedFinance,
  getDetailedQuality,
  getDetailedTarget,
  getDetailedComplaints
} = require("../controllers/getdatacontroller");

router.post("/", getStateDashboardData);

// Detailed summaries
router.post("/detailed/finance", getDetailedFinance);
router.post("/detailed/quality", getDetailedQuality);
router.post("/detailed/target", getDetailedTarget);
router.post("/detailed/complaints", getDetailedComplaints);

module.exports = router;


module.exports = router;
