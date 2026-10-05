const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const Habit = require("../models/Habit");

// Normalizes a "YYYY-MM-DD" string (or any date-ish value) to a UTC midnight
// Date, so log entries compare consistently regardless of server timezone.
const toUTCDateOnly = (value) => {
    const d = new Date(value);
    if (isNaN(d.getTime())) return null;
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
};

const sameDay = (a, b) => toUTCDateOnly(a)?.getTime() === toUTCDateOnly(b)?.getTime();

router.get("/", protect, async (req, res) => {
    try {
        const habits = await Habit.find({
            user: req.user._id
        }).sort({ createdAt: 1 });

        res.json(habits);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

router.post("/", protect, async (req, res) => {
    try {
        const habit = await Habit.create({
            title: req.body.title,
            description: req.body.description,
            frequency: req.body.frequency,
            daysOfWeek: Array.isArray(req.body.daysOfWeek) ? req.body.daysOfWeek : [],
            color: req.body.color,
            user: req.user._id
        });

        res.status(201).json(habit);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

router.put("/:id", protect, async (req, res) => {
    try {
        // Same explicit-whitelist pattern used in taskRoutes.js: only these
        // fields can ever be changed here, and logs are never touched by this
        // route (that's what PUT /:id/toggle is for).
        const allowedFields = ["title", "description", "frequency", "daysOfWeek", "color"];
        const updates = {};
        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        const habit = await Habit.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user._id
            },
            updates,
            {
                new: true,
                runValidators: true
            }
        );

        if (!habit) {
            return res.status(404).json({
                message: "Habit not found"
            });
        }

        res.json(habit);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// Toggles a single day on/off for a habit. Body: { date: "YYYY-MM-DD" }.
// If that day is already logged, it's removed (un-check); otherwise it's added.
router.put("/:id/toggle", protect, async (req, res) => {
    try {
        const targetDate = toUTCDateOnly(req.body.date);
        if (!targetDate) {
            return res.status(400).json({
                message: "A valid date is required"
            });
        }

        const habit = await Habit.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!habit) {
            return res.status(404).json({
                message: "Habit not found"
            });
        }

        const alreadyLogged = habit.logs.some((log) => sameDay(log, targetDate));

        if (alreadyLogged) {
            habit.logs = habit.logs.filter((log) => !sameDay(log, targetDate));
        } else {
            habit.logs.push(targetDate);
        }

        await habit.save();
        res.json(habit);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

router.delete("/:id", protect, async (req, res) => {
    try {
        const habit = await Habit.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if (!habit) {
            return res.status(404).json({
                message: "Habit not found"
            });
        }

        res.json({
            message: "Habit deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;
