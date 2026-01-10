const StateLevel = require("../schema/Statelevel");
const StateSummary = require("../schema/StateSummary");

/**
 * POST /getdata/state
 * Body: { state: "Jharkhand" }
 */
exports.getStateDashboardData = async (req, res) => {
  try {
    const { state } = req.body;

    if (!state) {
      return res.status(400).json({
        success: false,
        message: "State is required in request body"
      });
    }

    // ---------- Fetch State-Level Numbers ----------
    const stateData = await StateLevel.findOne({ state }).lean();

    if (!stateData) {
      return res.status(404).json({
        success: false,
        message: "State data not found"
      });
    }

    // ---------- Fetch LLM Summary ----------
    const summaryDoc = await StateSummary.findOne({ state }).lean();

    return res.json({
      success: true,
      state,

      finance: {
        budget: stateData.budget,
        utilised: stateData.utilised
      },

      physical: {
        target: stateData.target,
        completed: stateData.completed
      },

      summaries: summaryDoc
        ? {
            finance:
              summaryDoc.summary?.alerts?.finance?.oneLine || "",
            quality:
              summaryDoc.summary?.alerts?.quality?.oneLine || "",
            target:
              summaryDoc.summary?.alerts?.target?.oneLine || "",
            complaints:
              summaryDoc.summary?.alerts?.complaints?.oneLine || ""
          }
        : {
            finance: "",
            quality: "",
            target: "",
            complaints: ""
          }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Generic helper to fetch detailed alert
 */
const getDetailedAlert = async (req, res, alertType) => {
  try {
    const { state } = req.body;

    if (!state) {
      return res.status(400).json({
        success: false,
        message: "State is required"
      });
    }

    const summaryDoc = await StateSummary.findOne({ state }).lean();

    if (!summaryDoc) {
      return res.status(404).json({
        success: false,
        message: "Summary not found for state"
      });
    }

    const detailed =
      summaryDoc.summary?.alerts?.[alertType]?.detailed;

    return res.json({
      success: true,
      state,
      type: alertType,
      detailed: detailed || ""
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * POST /getdata/detailed/finance
 */
exports.getDetailedFinance = (req, res) =>
  getDetailedAlert(req, res, "finance");

/**
 * POST /getdata/detailed/quality
 */
exports.getDetailedQuality = (req, res) =>
  getDetailedAlert(req, res, "quality");

/**
 * POST /getdata/detailed/target
 */
exports.getDetailedTarget = (req, res) =>
  getDetailedAlert(req, res, "target");

/**
 * POST /getdata/detailed/complaints
 */
exports.getDetailedComplaints = (req, res) =>
  getDetailedAlert(req, res, "complaints");
