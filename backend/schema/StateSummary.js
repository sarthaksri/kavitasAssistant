const mongoose = require("mongoose");

const StateSummarySchema = new mongoose.Schema(
  {
    state: {
      type: String,
      required: true,
      unique: true
    },

    summary: {
      type: Object, // parsed JSON from Gemini
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("StateSummary", StateSummarySchema);
