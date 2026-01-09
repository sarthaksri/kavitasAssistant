const StateLevel = require("../schema/Statelevel");
const DistrictLevel = require("../schema/Districtlevel");

/**
 * POST /workers
 * Fetch financial + physical summary (State Level)
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
    const { state } = req.params;

    const data = await DistrictLevel.aggregate([
      { $match: { state } },

      {
        $group: {
          _id: "$district",

          totalSQM: { $sum: "$sqmcount" },
          totalNQM: { $sum: "$nqmcount" },

          sqmFail: {
            $sum: {
              $cond: [{ $eq: ["$sqmquality", "unsatisfactory"] }, "$sqmcount", 0]
            }
          },

          nqmFail: {
            $sum: {
              $cond: [{ $eq: ["$nqmquality", "unsatisfactory"] }, "$nqmcount", 0]
            }
          }
        }
      },

      {
        $project: {
          district: "$_id",
          _id: 0,

          sqmPercentage: {
            $cond: [
              { $eq: ["$totalSQM", 0] },
              0,
              { $multiply: [{ $divide: ["$sqmFail", "$totalSQM"] }, 100] }
            ]
          },

          nqmPercentage: {
            $cond: [
              { $eq: ["$totalNQM", 0] },
              0,
              { $multiply: [{ $divide: ["$nqmFail", "$totalNQM"] }, 100] }
            ]
          },

          totalSQM: 1,
          totalNQM: 1,
          sqmFail: 1,
          nqmFail: 1
        }
      }
    ]);

    // 🔹 Calculate state totals
    let stateSQM = 0,
        stateSQMFail = 0,
        stateNQM = 0,
        stateNQMFail = 0;

    data.forEach(d => {
      stateSQM += d.totalSQM;
      stateSQMFail += d.sqmFail;
      stateNQM += d.totalNQM;
      stateNQMFail += d.nqmFail;
    });

    const sqmPercent = stateSQM === 0 ? 0 : (stateSQMFail / stateSQM) * 100;
    const nqmPercent = stateNQM === 0 ? 0 : (stateNQMFail / stateNQM) * 100;

    res.json({
      state,
      stateQuality: {
        sqm: {
          percentage: +sqmPercent.toFixed(2),
          status: sqmPercent > 20 ? "unsatisfactory" : "satisfactory"
        },
        nqm: {
          percentage: +nqmPercent.toFixed(2),
          status: nqmPercent > 20 ? "unsatisfactory" : "satisfactory"
        }
      },
      districts: data.map(d => ({
        district: d.district,
        sqmPercentage: +d.sqmPercentage.toFixed(2),
        nqmPercentage: +d.nqmPercentage.toFixed(2)
      }))
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
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
