const mongoose = require("mongoose");
const { Schema } = mongoose;

const MealPlanSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    goal: {
      type: String,
      required: true,
    },
    preferences: {
      type: [String],
      default: [],
    },
    planText: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Created at, Updated at
  }
);

module.exports = mongoose.model("MealPlan", MealPlanSchema);
