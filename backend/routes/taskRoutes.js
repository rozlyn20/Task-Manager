const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const Task = require("../models/Task");
router.put("/:id", protect, async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user._id
            },
            req.body,
            {
                new: true
            }
        );
        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.json(task);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});
router.delete("/:id", protect, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.json({
            message: "Task deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});
router.post("/", protect, async (req, res) => {
    try {
        const task = await Task.create({
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            dueDate: req.body.dueDate,
            user: req.user._id
        });

        res.status(201).json(task);
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});
router.get("/", protect, async (req, res) => {
    try {
        const tasks = await Task.find({
            user: req.user._id
        });

        res.json(tasks);
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;