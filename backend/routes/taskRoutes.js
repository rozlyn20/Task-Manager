// const express = require("express");
// const router = express.Router();
// const protect = require("../middleware/authMiddleware");

// const Task = require("../models/Task");
// router.put("/:id", protect, async (req, res) => {
//     try {
//         const allowedFields = ["title", "description", "category", "dueDate", "completed", "status"];
//         const updates = {};
//         allowedFields.forEach((field) => {
//             if (req.body[field] !== undefined) {
//                 updates[field] = req.body[field];
//             }
//         });

//         const task = await Task.findOneAndUpdate(
//             {
//                 _id: req.params.id,
//                 user: req.user._id
//             },
//             updates,
//             {
//                 new: true,
//                 runValidators: true
//             }
//         );
//         if (!task) {
//             return res.status(404).json({
//                 message: "Task not found"
//             });
//         }

//         res.json(task);

//     } catch (error) {
//         res.status(500).json({
//             message: error.message
//         });
//     }
// });
// router.delete("/:id", protect, async (req, res) => {
//     try {
//         const task = await Task.findOneAndDelete({
//             _id: req.params.id,
//             user: req.user._id
//         });

//         if (!task) {
//             return res.status(404).json({
//                 message: "Task not found"
//             });
//         }

//         res.json({
//             message: "Task deleted successfully"
//         });

//     } catch (error) {
//         res.status(500).json({
//             message: error.message
//         });
//     }
// });
// router.post("/", protect, async (req, res) => {
//     try {
//         const task = await Task.create({
//             title: req.body.title,
//             description: req.body.description,
//             category: req.body.category,
//             dueDate: req.body.dueDate,
//             user: req.user._id
//         });

//         res.status(201).json(task);
//     }
//     catch (error) {
//         res.status(500).json({
//             message: error.message
//         });
//     }
// });
// router.get("/", protect, async (req, res) => {
//     try {
//         const tasks = await Task.find({
//             user: req.user._id
//         });

//         res.json(tasks);
//     }
//     catch (error) {
//         res.status(500).json({
//             message: error.message
//         });
//     }
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const Task = require("../models/Task");
router.post("/bulk", protect, async (req, res) => {
    try {
        const { tasks } = req.body;
        if (!Array.isArray(tasks) || tasks.length < 1 || tasks.length > 100) {
            return res.status(400).json({ message: "Provide between 1 and 100 tasks." });
        }
        const allowedCategories = ["Personal", "Work", "Other"];
        const documents = tasks.map((task) => ({
            title: typeof task.title === "string" ? task.title.trim().slice(0, 200) : "",
            description: typeof task.description === "string" ? task.description.trim().slice(0, 2000) : "",
            category: allowedCategories.includes(task.category) ? task.category : "Personal",
            dueDate: task.dueDate || undefined,
            user: req.user._id
        }));
        if (documents.some((task) => !task.title)) {
            return res.status(400).json({ message: "Every task needs a title." });
        }
        const created = await Task.insertMany(documents, { ordered: true });
        res.status(201).json({ created: created.length, tasks: created });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.put("/:id", protect, async (req, res) => {
    try {
        const allowedFields = ["title", "description", "category", "dueDate", "completed", "status"];
        const updates = {};
        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        const task = await Task.findOneAndUpdate(
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
