import express from "express";
import todoController from "../controllers/todoController.js";
import requireAuth from "../middleware/requireAuth.js";

const { createTodo, deleteTodo, getTodosByDate } = todoController;

const router = express.Router();

router.use(requireAuth);

router.get("/:date", getTodosByDate);
router.post("/", createTodo);
router.delete("/:id", deleteTodo);

export default router;
