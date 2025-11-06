import express from "express";
import Todo from "../models/Todo.js";

const router = express.Router();

// Get todos for a specific date
router.get("/:date", async (req, res) => {
  try {
    const todos = await Todo.find({ date: req.params.date });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new todo
// router.post("/", async (req, res) => {
//   try {
//     const { text, date, exercise, rating, checked, sets, reps, weight } = req.body;
//     const newTodo = new Todo({ text, date, exercise, rating, checked, sets, reps, weight });
//     const savedTodo = await newTodo.save();
//     res.json(savedTodo);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });
router.post("/", async (req, res) => {
  try {
    const { text, date } = req.body;
    const newTodo = new Todo({ text, date });
    const savedTodo = await newTodo.save();
    console.log("Saved todo:", savedTodo); // <-- check if _id exists
    res.json(savedTodo); // must include _id
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a todo
router.delete("/:id", async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: "Todo deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Update a todo (PATCH)
router.patch("/:id", async (req, res) => {
  console.log("PATCH request received for id:", req.params.id);
  try {
    const updates = req.body; // can include exercise too
    const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(updatedTodo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// ✅ default export
export default router;
