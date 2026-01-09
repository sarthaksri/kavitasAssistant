const DistrictLevel = require("../schema/Districtlevel");
const StateLevel = require("../schema/Statelevel");

/**
 * POST /workers/ingest
 * Body: [ { district objects... } ]
 */
exports.ingestDistrictData = async (req, res) => {
  try {
    const dataArray = req.body;

    if (!Array.isArray(dataArray) || dataArray.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Request body must be a non-empty array"
      });
    }

    let successCount = 0;
    let failed = [];

    for (const obj of dataArray) {
      try {
        // Ensure optional numeric fields are safe
        obj.packageutilised = obj.packageutilised || obj.packagebudget || 0;

        await DistrictLevel.create(obj);
        successCount++;
      } catch (err) {
        failed.push({
          packagenumber: obj.packagenumber,
          error: err.message
        });
      }
    }

    res.status(201).json({
      success: true,
      totalReceived: dataArray.length,
      inserted: successCount,
      failedCount: failed.length,
      failed
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Data ingestion failed",
      error: error.message
    });
  }
};


exports.ingestStateData = async (req, res) => {
  try {
    const dataArray = req.body;

    if (!Array.isArray(dataArray) || dataArray.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Request body must be a non-empty array"
      });
    }

    let successCount = 0;
    let failed = [];

    for (const obj of dataArray) {
      try {
        await StateLevel.create(obj);
        successCount++;
      } catch (err) {
        failed.push({
          state: obj.state,
          error: err.message
        });
      }
    }

    res.status(201).json({
      success: true,
      totalReceived: dataArray.length,
      inserted: successCount,
      failedCount: failed.length,
      failed
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "State data ingestion failed",
      error: error.message
    });
  }
};