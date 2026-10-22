
const { GoogleGenAI } = require("@google/genai");
const mongoose = require("mongoose");
const Plan = require("../models/Plan");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Helper: parse the JSON returned by Gemini
const parseGeminiJSON = (text) => {
  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  return JSON.parse(cleaned);
};

// POST /api/plans/generate
const generatePlan = async (req, res) => {
  try {
    const {
      title,
      goalDescription,
      startDate,
      targetDate,
      availableMinutesPerDay,
    } = req.body;

    if (
      !title?.trim() ||
      !goalDescription?.trim() ||
      !startDate ||
      !targetDate ||
      availableMinutesPerDay == null
    ) {
      return res.status(400).json({
        message:
          "Title, goal, start date, target date and available minutes per day are required.",
      });
    }

    const start = new Date(startDate);
    const target = new Date(targetDate);
    const dailyMinutes = Number(availableMinutesPerDay);

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(target.getTime()) ||
      target <= start
    ) {
      return res.status(400).json({
        message: "Please provide valid dates. Target date must be after start date.",
      });
    }

    if (
      !Number.isFinite(dailyMinutes) ||
      !Number.isInteger(dailyMinutes) ||
      dailyMinutes < 5 ||
      dailyMinutes > 1440
    ) {
      return res.status(400).json({
        message: "Available minutes per day must be an integer between 5 and 1440.",
      });
    }

    const durationWeeks = Math.ceil(
      (target.getTime() - start.getTime()) /
        (7 * 24 * 60 * 60 * 1000)
    );

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
You are the planning engine of a productivity application.
Turn the user's goal into a realistic, executable plan.

USER GOAL:
${goalDescription.trim()}

PLAN TITLE: ${title.trim()}
START DATE: ${start.toISOString().slice(0, 10)}
TARGET DATE: ${target.toISOString().slice(0, 10)}
AVAILABLE TIME: ${dailyMinutes} minutes per day
PLAN LENGTH: ${durationWeeks} weeks

Return ONLY valid JSON. Do not use Markdown or code fences.
Use this exact structure:
{
  "milestones": [
    {
      "title": "Milestone title",
      "description": "Expected outcome",
      "tasks": [
        {
          "title": "Specific actionable task",
          "description": "What to do",
          "durationMinutes": 45,
          "priority": "medium",
          "weekNumber": 1,
          "completionCriteria": "How completion is verified",
          "dependencies": []
        }
      ]
    }
  ]
}

Rules:
- Generate practical tasks, not vague advice.
- Every task must have a measurable completion criterion.
- durationMinutes must be an integer of at least 5.
- priority must be low, medium, or high.
- weekNumber must be an integer between 1 and ${durationWeeks}.
- dependencies must be an array of task titles that this task depends on.
- Order tasks so prerequisites come before dependent tasks.
- Respect the user's available time. Do not overload the daily capacity.
- Spread tasks across the plan duration.
- Do not invent achievements or claim the user has completed anything.
- Return between 1 and 8 milestones, with a reasonable number of tasks for the goal.
`,
    });

    const generated = parseGeminiJSON(response.text || "");

    if (
      !generated ||
      !Array.isArray(generated.milestones) ||
      generated.milestones.length === 0
    ) {
      return res.status(502).json({
        message: "The AI returned an invalid plan. Please try again.",
      });
    }

    // Validate and normalize the AI response before saving.
    const allowedPriorities = ["low", "medium", "high"];

    const milestones = generated.milestones.map((milestone) => {
      if (
        typeof milestone.title !== "string" ||
        !milestone.title.trim() ||
        !Array.isArray(milestone.tasks)
      ) {
        throw new Error("Invalid milestone returned by AI.");
      }

      return {
        title: milestone.title.trim(),
        description:
          typeof milestone.description === "string"
            ? milestone.description
            : "",
        tasks: milestone.tasks.map((task) => {
          if (
            typeof task.title !== "string" ||
            !task.title.trim() ||
            !Number.isInteger(task.durationMinutes) ||
            task.durationMinutes < 5 ||
            !Number.isInteger(task.weekNumber) ||
            task.weekNumber < 1 ||
            task.weekNumber > durationWeeks ||
            !allowedPriorities.includes(task.priority)
          ) {
            throw new Error("Invalid task returned by AI.");
          }

          return {
            title: task.title.trim(),
            description:
              typeof task.description === "string"
                ? task.description
                : "",
            durationMinutes: task.durationMinutes,
            priority: task.priority,
            weekNumber: task.weekNumber,
            completionCriteria:
              typeof task.completionCriteria === "string"
                ? task.completionCriteria
                : "",
            dependencies: Array.isArray(task.dependencies)
              ? task.dependencies.filter(
                  (dependency) => typeof dependency === "string"
                )
              : [],
          };
        }),
      };
    });

    const plan = await Plan.create({
      userId: req.user._id,
      title: title.trim(),
      goalDescription: goalDescription.trim(),
      startDate: start,
      targetDate: target,
      availableMinutesPerDay: dailyMinutes,
      status: "draft",
      milestones,
    });

    return res.status(201).json({
      message: "Plan generated successfully.",
      plan,
    });
  } catch (error) {
    console.error("Generate plan error:", error);

    return res.status(500).json({
      message:
        error.message === "Invalid milestone returned by AI." ||
        error.message === "Invalid task returned by AI."
          ? "The AI generated an invalid plan. Please try again."
          : "Failed to generate plan. Please try again.",
    });
  }
};

// GET /api/plans
const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json(plans);
  } catch (error) {
    console.error("Get plans error:", error);
    return res.status(500).json({
      message: "Failed to fetch plans.",
    });
  }
};

// GET /api/plans/:id
const getPlanById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid plan ID." });
    }

    const plan = await Plan.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!plan) {
      return res.status(404).json({ message: "Plan not found." });
    }

    return res.status(200).json(plan);
  } catch (error) {
    console.error("Get plan error:", error);
    return res.status(500).json({
      message: "Failed to fetch plan.",
    });
  }
};

// PATCH /api/plans/:id
const updatePlan = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid plan ID." });
    }

    const plan = await Plan.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!plan) {
      return res.status(404).json({ message: "Plan not found." });
    }

    if (plan.status !== "draft") {
      return res.status(400).json({
        message: "Only draft plans can be edited.",
      });
    }

    const allowedFields = [
      "title",
      "goalDescription",
      "startDate",
      "targetDate",
      "availableMinutesPerDay",
      "milestones",
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        plan.set(field, req.body[field]);
      }
    }

    if (
      !plan.title?.trim() ||
      !plan.goalDescription?.trim() ||
      !Number.isFinite(plan.startDate?.getTime()) ||
      !Number.isFinite(plan.targetDate?.getTime()) ||
      plan.targetDate <= plan.startDate ||
      !Number.isInteger(plan.availableMinutesPerDay) ||
      plan.availableMinutesPerDay < 5 ||
      plan.availableMinutesPerDay > 1440
    ) {
      return res.status(400).json({
        message: "Invalid plan details.",
      });
    }

    await plan.save();

    return res.status(200).json({
      message: "Plan updated successfully.",
      plan,
    });
  } catch (error) {
    console.error("Update plan error:", error);
    return res.status(400).json({
      message: "Failed to update plan. Check the supplied fields.",
    });
  }
};

// DELETE /api/plans/:id
const deletePlan = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid plan ID." });
    }

    const plan = await Plan.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!plan) {
      return res.status(404).json({ message: "Plan not found." });
    }

    if (plan.status !== "draft") {
      return res.status(400).json({
        message: "Only draft plans can be deleted.",
      });
    }

    await plan.deleteOne();

    return res.status(200).json({
      message: "Draft plan deleted successfully.",
    });
  } catch (error) {
    console.error("Delete plan error:", error);
    return res.status(500).json({
      message: "Failed to delete plan.",
    });
  }
};

module.exports = {
  generatePlan,
  getPlans,
  getPlanById,
  updatePlan,
  deletePlan,
};
