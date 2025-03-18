const express = require("express");
const Tip = require("../models/tip")
const { body, validationResult } = require("express-validator");

const router = express.Router();

// ✅ CREATE a new tip
router.post(
    "/",
    [
        body("title").notEmpty().withMessage("Title is required"),
        body("category").isIn(["Preparation", "Finance", "Security", "Culture", "General"])
            .withMessage("Invalid category"),
        body("content").notEmpty().withMessage("Content is required"),
        body("importance").isInt({ min: 1, max: 5 }).withMessage("Importance must be between 1 and 5"),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const newTip = new Tip({ ...req.body });
            await newTip.save();
            res.status(201).json(newTip);
        } catch (error) {
            res.status(500).json({ message: "Error creating tip", error });
        }
    }
);

router.get("/", async (req, res) => {
    try {
        const { category } = req.query;
        const filter = category ? { category } : {}; 
        const tips = await Tip.find(filter);
        res.status(200).json(tips);
    } catch (error) {
        res.status(500).json({ message: "Error fetching tips", error });
    }
});

// ✅ GET a single tip by ID
router.get("/:id", async (req, res) => {
    try {
        const tip = await Tip.findById(req.params.id);
        if (!tip) return res.status(404).json({ message: "Tip not found" });
        res.status(200).json(tip);
    } catch (error) {
        res.status(500).json({ message: "Error fetching tip", error });
    }
});


router.put("/:id", async (req, res) => {
    try {
        const updatedTip = await Tip.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedTip) return res.status(404).json({ message: "Tip not found" });
        res.status(200).json(updatedTip);
    } catch (error) {
        res.status(500).json({ message: "Error updating tip", error });
    }
});


router.delete("/:id", async (req, res) => {
    try {
        const deletedTip = await Tip.findByIdAndDelete(req.params.id);
        if (!deletedTip) return res.status(404).json({ message: "Tip not found" });
        res.status(200).json({ message: "Tip deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting tip", error });
    }
});


router.post("/:id/like", async (req, res) => {
    try {
        const tip = await Tip.findById(req.params.id);
        if (!tip) return res.status(404).json({ message: "Tip not found" });

        tip.likes += 1;
        await tip.save();
        res.status(200).json({ message: "Tip liked", likes: tip.likes });
    } catch (error) {
        res.status(500).json({ message: "Error liking tip", error });
    }
});

router.post("/:id/comment", async (req, res) => {
    try {
        const { user, comment } = req.body;
        if (!comment) return res.status(400).json({ message: "Comment cannot be empty" });

        const tip = await Tip.findById(req.params.id);
        if (!tip) return res.status(404).json({ message: "Tip not found" });

        tip.comments.push({ user, comment, createdAt: new Date() });
        await tip.save();
        
        res.status(201).json({ message: "Comment added", comments: tip.comments });
    } catch (error) {
        console.error("🔥 Error adding comment:", error); // Debugging line
        res.status(500).json({ message: "Error adding comment", error: error.message });
    }
});


module.exports = router;
