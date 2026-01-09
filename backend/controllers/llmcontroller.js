const { generateSummary } = require("../utils/gemini");
const { buildStateSummaryPrompt } = require("../utils/prompts");
const workersController = require("./workerscontroller");
const StateSummary = require("../schema/StateSummary");

// Helper to capture res.json output
function captureResponse() {
  let data;
  return {
    res: {
      status: () => ({
        json: (payload) => {
          data = payload;
        }
      }),
      json: (payload) => {
        data = payload;
      }
    },
    getData: () => data
  };
}

exports.getStateSummaryLLM = async (req, res) => {
  try {
    const { state } = req.body;

    if (!state) {
      return res.status(400).json({
        success: false,
        message: "State is required"
      });
    }

    // ---------- Finance ----------
    const fin = captureResponse();
    await workersController.getFinLLM({ body: { state } }, fin.res);
    const financeData = fin.getData();

    // ---------- Quality ----------
    const qual = captureResponse();
    await workersController.getQualityLLM({ body: { state } }, qual.res);
    const qualityData = qual.getData();

    // ---------- Target ----------
    const targ = captureResponse();
    await workersController.getTargetLLM({ body: { state } }, targ.res);
    const targetData = targ.getData();

    // ---------- Complaints ----------
    const comp = captureResponse();
    await workersController.getComplaintLLM({ body: { state } }, comp.res);
    const complaintsData = comp.getData();

    // ---------- Gemini ----------
    const prompt = buildStateSummaryPrompt(
      state,
      financeData,
      qualityData,
      targetData,
      complaintsData
    );

    const summary = JSON.parse(await generateSummary(prompt));

    // ---------- UPSERT INTO MONGO ----------
    const savedSummary = await StateSummary.findOneAndUpdate(
      { state },
      { summary },
      {
        new: true,      // return updated document
        upsert: true    // insert if not exists
      }
    );

    return res.json({
      success: true,
      state,
      summary: savedSummary.summary,
      updatedAt: savedSummary.updatedAt
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
