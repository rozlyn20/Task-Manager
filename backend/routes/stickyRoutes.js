const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getStickies,
  createSticky,
  updateSticky,
  deleteSticky,
} = require("../controllers/stickyController");

router.get("/", protect, getStickies);

router.post("/", protect, createSticky);

router.put("/:id", protect, updateSticky);

router.delete("/:id", protect, deleteSticky);

module.exports = router;