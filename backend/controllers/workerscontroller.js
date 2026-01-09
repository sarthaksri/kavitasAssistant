const StateLevel = require("../schema/Statelevel");
const DistrictLevel = require("../schema/Districtlevel");

/**
 * POST /workers
 * Fetch financial + physical summary (State Level)
 */
const DistrictLevel = require("../schema/Districtlevel");

/**
 * POST /workers/finllm
 * Body: { state: "StateName" }
 */
exports.getFinLLM = async (req, res) => {
  try {
    const { state } = req.body;

    if (!state) {
      return res.status(400).json({
        success: false,
        message: "State is required in request body"
      });
    }

    const packages = await DistrictLevel.find(
      { state },
      {
        district: 1,
        packagenumber: 1,
        packageutilised: 1,
        packagevop: 1
      }
    );

    if (packages.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No packages found for given state"
      });
    }

    const result = packages.map(pkg => {
      const utilised = pkg.packageutilised || 0;
      const vop = pkg.packagevop || 0;

      const vue =
        utilised > 0 ? Number((vop / utilised).toFixed(2)) : 0;

      const lagAmount = Number((utilised - vop).toFixed(2));

      var meaning = "critical";
      if (vue >= 0.85) meaning = "good";
      else if (vue >= 0.6) meaning = "moderate";

      return {
        district: pkg.district,
        packagenumber: pkg.packagenumber,
        vue,
        lagAmount,
        meaning
      };
    });

    res.status(200).json({
      success: true,
      state,
      totalPackages: result.length,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error calculating financial lag",
      error: error.message
    });
  }
};


/**
 * GET QUALITY STATUS (SQM + NQM)
 * Route: /workers/quality
 */
exports.getQualityLLM = async (req, res) => {
  try {
    
  } catch (error) {
    
  }
};

/**
 * GET TARGET vs COMPLETION (MONTHLY + CUMULATIVE)
 * Route: /workers/target
 */
exports.getTargetLLM = async (req, res) => {
  try {
    
  } catch (error) {
    
  }
};
