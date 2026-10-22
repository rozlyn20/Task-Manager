const mongoose = require("mongoose");

const plannedTaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    durationMinutes: {
      type: Number,
      required: true,
      min: 5,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    weekNumber: {
      type: Number,
      required: true,
      min: 1,
    },
    completionCriteria: {
      type: String,
      default: "",
    },
    dependencies: [{
      type: String,
    }],
  },
  { _id: true }
);

const milestoneSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  tasks: [plannedTaskSchema],
});

const planSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    goalDescription: {
      type: String,
      required: true,
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    targetDate: {
      type: Date,
      required: true,
    },
    availableMinutesPerDay: {
      type: Number,
      required: true,
      min: 5,
    },
    status: {
      type: String,
      enum: ["draft", "approved", "active", "completed"],
      default: "draft",
    },
    milestones: [milestoneSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Plan", planSchema);