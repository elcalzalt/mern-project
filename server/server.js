import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRoutes from "./routes/user.js";
import todoRoutes from "./routes/todo.js";
import dotenv from "dotenv";

dotenv.config();
const BACKEND_PORT = process.env.BACKEND_PORT || 5050;
const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/user", userRoutes);
app.use("/api/todo", todoRoutes);

const URI = process.env.ATLAS_URI || "";
mongoose
	.connect(URI)
	.then(() => {
		app.listen(BACKEND_PORT, () => {
			console.log(`Server listening on port ${BACKEND_PORT}`);
		});
	})
	.catch((err) => {
		console.log(err);
	});
