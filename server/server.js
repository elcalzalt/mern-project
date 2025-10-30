import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRoutes from "./routes/user.js";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/user", userRoutes);

const URI = process.env.ATLAS_URI || "";
mongoose
	.connect(URI)
	.then(() => {
		app.listen(PORT, () => {
			console.log(`Server listening on port ${PORT}`);
		});
	})
	.catch((err) => {
		console.log(err);
	});
