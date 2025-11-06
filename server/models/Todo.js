import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  text: { type: String, required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  exercise: { type: String, default: "" },
  rating: { type: Number, default: 2 },
  checked: { type: Boolean, default: false },
  sets: { type: Number, default: 4 },
  reps: { type: Number, default: 10 },
  weight: { type: String, default: "" },
});

const Todo = mongoose.model("Todo", todoSchema);


// default export
export default Todo;
