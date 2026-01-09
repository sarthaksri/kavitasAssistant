const {ingestDistrictLevelData, ingestStateData} = require('../controllers/dataingestionController');

const express = require('express');
const router = express.Router();
// POST /workers/ingest
router.post('/ingest/district', ingestDistrictLevelData);
router.post("/ingest/state", ingestStateData);

module.exports = router;