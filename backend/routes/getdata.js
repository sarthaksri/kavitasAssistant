const express = require("express");
const router = express.Router();

const {
  getStateDashboardData
} = require("../controllers/getdatacontroller");

router.post("/", getStateDashboardData);

module.exports = router;
