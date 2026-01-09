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
    // 1. Get state from body (as per your getFinLLM pattern)
    const { state } = req.body;

    if (!state) {
      return res.status(400).json({
        success: false,
        message: "State is required in request body"
      });
    }

    // 2. Fetch raw data
    const records = await DistrictLevel.find(
      { state },
      {
        district: 1,
        sqmcount: 1,
        nqmcount: 1,
        sqmquality: 1,
        nqmquality: 1
      }
    );

    if (records.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No quality data found for the given state"
      });
    }

    // 3. Process data (Grouping by district manually)
    const districtMap = {};
    let stateSQM = 0, stateSQMFail = 0, stateNQM = 0, stateNQMFail = 0;

    records.forEach(rec => {
      const dist = rec.district;
      if (!districtMap[dist]) {
        districtMap[dist] = { totalSQM: 0, sqmFail: 0, totalNQM: 0, nqmFail: 0 };
      }

      const sCount = rec.sqmcount || 0;
      const nCount = rec.nqmcount || 0;

      // Update District totals
      districtMap[dist].totalSQM += sCount;
      districtMap[dist].totalNQM += nCount;
      if (rec.sqmquality === "unsatisfactory") districtMap[dist].sqmFail += sCount;
      if (rec.nqmquality === "unsatisfactory") districtMap[dist].nqmFail += nCount;

      // Update State totals
      stateSQM += sCount;
      stateNQM += nCount;
      if (rec.sqmquality === "unsatisfactory") stateSQMFail += sCount;
      if (rec.nqmquality === "unsatisfactory") stateNQMFail += nCount;
    });

    // 4. Format District Results
    const districtResults = Object.keys(districtMap).map(distName => {
      const d = districtMap[distName];
      return {
        district: distName,
        sqmPercentage: d.totalSQM === 0 ? 0 : Number(((d.sqmFail / d.totalSQM) * 100).toFixed(2)),
        nqmPercentage: d.totalNQM === 0 ? 0 : Number(((d.nqmFail / d.totalNQM) * 100).toFixed(2))
      };
    });

    // 5. Calculate State percentages and status
    const sqmPercent = stateSQM === 0 ? 0 : (stateSQMFail / stateSQM) * 100;
    const nqmPercent = stateNQM === 0 ? 0 : (stateNQMFail / stateNQM) * 100;

    res.status(200).json({
      success: true,
      state,
      stateQuality: {
        sqm: {
          percentage: Number(sqmPercent.toFixed(2)),
          status: sqmPercent > 20 ? "unsatisfactory" : "satisfactory"
        },
        nqm: {
          percentage: Number(nqmPercent.toFixed(2)),
          status: nqmPercent > 20 ? "unsatisfactory" : "satisfactory"
        }
      },
      districts: districtResults
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error calculating quality metrics",
      error: error.message
    });
  }
};

/**
 * GET TARGET vs COMPLETION (MONTHLY + CUMULATIVE)
 * Route: /workers/target
 */
exports.getTargetLLM = async (req, res) => {
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
        monthlytarget: 1,
        monthlycompleted: 1
      }
    );

    if (packages.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No packages found for given state"
      });
    }

    const result = packages
      .map(pkg => {
        const totalTarget = (pkg.monthlytarget || []).reduce(
          (a, b) => a + b,
          0
        );
        const totalCompleted = (pkg.monthlycompleted || []).reduce(
          (a, b) => a + b,
          0
        );

        const achievement =
          totalTarget > 0
            ? Number((totalCompleted / totalTarget).toFixed(2))
            : 0;

        var meaning = "good";
        if (achievement < 0.6) meaning = "critical";
        else if (achievement < 0.8) meaning = "moderate";

        return {
          district: pkg.district,
          packagenumber: pkg.packagenumber,
          totalTarget,
          totalCompleted,
          achievement,
          meaning
        };
      })
      // only return moderate + critical
      .filter(pkg => pkg.meaning !== "good");

    res.status(200).json({
      success: true,
      state,
      totalFlaggedPackages: result.length,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error analyzing target achievement",
      error: error.message
    });
  }
};
