const Sticky = require("../models/Sticky");

// GET all sticky notes
const getStickies = async (req, res) => {
  try {
    const stickies = await Sticky.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.json(stickies);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// CREATE sticky note
const createSticky = async (req, res) => {
  try {
    const { title, content, color } = req.body;

    const sticky = await Sticky.create({
      title,
      content,
      color,
      user: req.user.id,
    });

    res.status(201).json(sticky);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// UPDATE sticky note
const updateSticky = async (req, res) => {
  try {
    const sticky = await Sticky.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      req.body,
      { new: true }
    );

    if (!sticky) {
      return res.status(404).json({
        message: "Sticky note not found",
      });
    }

    res.json(sticky);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// DELETE sticky note
const deleteSticky = async (req, res) => {
  try {
    const sticky = await Sticky.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!sticky) {
      return res.status(404).json({
        message: "Sticky note not found",
      });
    }

    res.json({
      message: "Sticky note deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  getStickies,
  createSticky,
  updateSticky,
  deleteSticky,
};