const mongoose = require("mongoose");

const StateLevelSchema = new mongoose.Schema(
  {
    state: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    target: {
      type: Number,
      required: true
    },

    completed: {
      type: Number,
      default: 0
    },

    budget: {
      type: Number, // in crore
      required: true
    },

    utilised: {
      type: Number, // in crore
      default: 0
    },

    roadinspected: {
      type: Number,
      default: 0
    },

    roadfailinspected: {
      type: Number,
      default: 0
    },

    vop: {
      type: Number, // value of projects / value of progress
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("StateLevel", StateLevelSchema);
