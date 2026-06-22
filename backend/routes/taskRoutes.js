const express = require("express");
const router = express.Router();

const Task = require("../models/Task");
router.put("/:id", async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
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
router.delete("/:id", async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

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
router.post("/", async (req, res) => {
    try {
        const task = await Task.create({
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            dueDate: req.body.dueDate
        });

        res.status(201).json(task);
    }
    catch(error){
        res.status(500).json({
            message:error.message
        });
    }
});
router.get("/", async (req, res) => {
    try {
        const tasks = await Task.find();

        res.json(tasks);
    }
    catch(error){
        res.status(500).json({
            message:error.message
        });
    }
});

module.exports = router;