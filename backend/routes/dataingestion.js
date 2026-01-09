const {ingestDistrictData, ingestStateData} = require('../controllers/dataingestcontroller');

const express = require('express');
const router = express.Router();
// POST /workers/ingest
router.post('/district', ingestDistrictData);
router.post("/state", ingestStateData);

module.exports = router;