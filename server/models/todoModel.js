import mongoose from "mongoose";

const Schema = mongoose.Schema;

const todoSchema = new Schema(
	{
		text: {
			type: String,
			required: true,
		},
		date: {
			type: String,
			required: true,
		},
		exercise: {
			type: String,
			default: "",
		},
		rating: {
			type: Number,
			default: 2,
		},
		checked: {
			type: Boolean,
			default: false,
		},
		sets: {
			type: Number,
			default: 4,
		},
		reps: {
			type: Number,
			default: 10,
		},
		weight: {
			type: String,
			default: "",
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		hpRemaining: { type: Number, default: 2 },
	},
	{ timestamps: true }
);

export default mongoose.model("Todo", todoSchema);
