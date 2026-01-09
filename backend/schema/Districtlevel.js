const mongoose = require("mongoose");

const DistrictLevelSchema = new mongoose.Schema(
  {
    state: {
      type: String,
      required: true,
      trim: true,
      ref: "StateLevel"
    },

    district: {
      type: String,
      required: true,
      trim: true
    },

    sanctionyear: {
      type: Number,
      required: true
    },

    packagenumber: {
      type: String,
      required: true,
      trim: true
    },

    // 🔹 Package-level financials (₹ crore)
    packageutilised: {
      type: Number,
      required: true
    },

    packagevop: {
      type: Number,
      default: 0
    },

    complaintspending: {
      type: Number,
      default: 0
    },

    roadlength: {
      type: Number, // km
      required: true
    },

    // 🔹 Monthly target (Apr–Mar)
    monthlytarget: {
      type: [Number],
      validate: {
        validator: function (arr) {
          return arr.length === 12;
        },
        message: "monthlytarget must contain exactly 12 values"
      },
      default: Array(12).fill(0)
    },

    // 🔹 Monthly completed (Apr–Mar)
    monthlycompleted: {
      type: [Number],
      validate: {
        validator: function (arr) {
          return arr.length === 12;
        },
        message: "monthlycompleted must contain exactly 12 values"
      },
      default: Array(12).fill(0)
    },

    sqmcount: {
      type: Number,
      default: 0
    },

    sqmquality: {
      type: String,
      enum: ["satisfactory", "needimprovement", "unsatisfactory"],
      required: true
    },

    nqmcount: {
      type: Number,
      default: 0
    },

    nqmquality: {
      type: String,
      enum: ["satisfactory", "needimprovement", "unsatisfactory"],
      required: true
    }
  },
  {
    timestamps: true
  }
);

/**
 * Composite Unique Index
 * state + district + packagenumber
 */
DistrictLevelSchema.index(
  { state: 1, district: 1, packagenumber: 1 },
  { unique: true }
);

module.exports = mongoose.model("DistrictLevel", DistrictLevelSchema);
