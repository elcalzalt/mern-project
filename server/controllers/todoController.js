import mongoose from "mongoose";
import Todo from "../models/todoModel.js";

const createTodo = async (req, res) => {
	if (!req.user || !req.user._id) {
		return res.status(401).json({ error: "Authentication required" });
	}

	const {
		text,
		date,
		exercise = "",
		rating = 2,
		checked = false,
		sets = 4,
		reps = 10,
		weight = "",
	} = req.body;

	if (!text || !date) {
		return res.status(400).json({ error: "Text and date are required" });
	}

	try {
		const todo = await Todo.create({
			text,
			date,
			exercise,
			rating,
			checked,
			sets,
			reps,
			weight,
			user: req.user._id,
		});

		res.status(201).json(todo);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};

const deleteTodo = async (req, res) => {
	if (!req.user || !req.user._id) {
		return res.status(401).json({ error: "Authentication required" });
	}

	const { id } = req.params;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).json({ error: "Invalid todo id" });
	}

	try {
		const todo = await Todo.findOneAndDelete({ _id: id, user: req.user._id });

		if (!todo) {
			return res.status(404).json({ error: "Todo not found" });
		}

		res.status(200).json({ message: "Todo deleted", todo });
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};

const getTodosByDate = async (req, res) => {
	if (!req.user || !req.user._id) {
		return res.status(401).json({ error: "Authentication required" });
	}

	const rawDate = req.params.date;

	if (!rawDate) {
		return res.status(400).json({ error: "Date is required" });
	}

	try {
		const date = decodeURIComponent(rawDate);
		const todos = await Todo.find({ user: req.user._id, date }).sort({ createdAt: 1 });
		res.status(200).json(todos);
	} catch (err) {
		res.status(400).json({ error: err.message });
	}
};

export default { createTodo, deleteTodo, getTodosByDate };
