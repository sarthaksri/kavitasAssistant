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
