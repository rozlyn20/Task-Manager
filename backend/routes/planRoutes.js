
const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  generatePlan,
  getPlans,
  getPlanById,
  updatePlan,
  deletePlan,
} = require("../controllers/planController");

// All Plan endpoints require authentication.
router.use(protect);

// Generate and save a draft.
router.post("/generate", generatePlan);

// List the logged-in user's plans.
router.get("/", getPlans);

// Fetch a single plan.
router.get("/:id", getPlanById);

// Edit a draft.
router.patch("/:id", updatePlan);

// Delete a draft.
router.delete("/:id", deletePlan);

module.exports = router;
