import express from "express";
import todoController from "../controllers/todoController.js";
import requireAuth from "../middleware/requireAuth.js";

const { createTodo, deleteTodo, getTodosByDate,updateTodo,getAllTodos  } = todoController;

const router = express.Router();

router.use(requireAuth);

router.get("/all", getAllTodos);

router.get("/:date", getTodosByDate);
router.post("/", createTodo);
router.delete("/:id", deleteTodo);
router.patch("/:id", updateTodo);

export default router;
