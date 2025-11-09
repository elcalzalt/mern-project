// import React, { useState } from "react";
// import "./Feature.css";
// import { TodoItem } from "./todoItem";
// import { styled } from "@mui/material/styles";
// import Rating from "@mui/material/Rating";
// import FavoriteIcon from "@mui/icons-material/Favorite";
// import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
// type TodoType = {
//   id: number; // unique
//   text: string;
// };
// const StyledRating = styled(Rating)({
//   "& .MuiRating-iconFilled": {
//     color: "#ff6d75",
//   },
//   "& .MuiRating-iconHover": {
//     color: "#ff3d47",
//   },
// });
// export const Todo = () => {
//   const [todos, setTodos] = useState<TodoType[]>([]);

//   const add = () => {
//     setTodos([
//       ...todos,
//       { id: Date.now(), text: `Exercise ${todos.length + 1}` },
//     ]);
//   };
//   const deleteTodo = (id: number) => {
//     setTodos(todos.filter((todo) => todo.id !== id));
//   };
//   return (
//     <>
//       <div className="todoFixWrap">
//         <div className="todoBtnWrap">
//           <button className="todoBtn" onClick={add}>
//             Add
//           </button>
//           <button className="todoBtn"> Share</button>
//           <button className="todoBtn"> Compare </button>
//         </div>
//         <div className="hpCheck">
//           <span>HP remaining after training: </span>
//           <StyledRating
//             name="customized-color"
//             defaultValue={2}
//             getLabelText={(value: number) =>
//               `${value} Heart${value !== 1 ? "s" : ""}`
//             }
//             precision={0.5}
//             icon={<FavoriteIcon fontSize="inherit" />}
//             emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
//           />
//         </div>
//       </div>

//       <div className="listBody" id="body">
//         {todos.map((todo, index) => (
//           <TodoItem
//             key={todo.id}
//             text={`Exercise ${index + 1}`}
//             onDelete={() => deleteTodo(todo.id)}
//           />
//         ))}
//       </div>
//     </>
//   );
// };
import React from "react";
import "./Feature.css";
import { TodoItem } from "./todoItem";
import { styled } from "@mui/material/styles";
import Rating from "@mui/material/Rating";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
export type TodoType = {
	id: number;
	exercise: string;
	text: string; // exercise name
	weight: string;
	sets: number;
	reps: number;
	rating: number;
	done: boolean;
	date: string;
};

type TodoProps = {
	todos: TodoType[];
	onChange: (newTodos: TodoType[]) => void;
	selectedDate: string;
	hpRemaining: number; // value passed from Feature
	setHpRemaining: (value: number | null) => void;
};

const StyledRating = styled(Rating)({
	"& .MuiRating-iconFilled": {
		color: "#ff6d75",
	},
	"& .MuiRating-iconHover": {
		color: "#ff3d47",
	},
});
const API_BASE = `${API_BASE_URL}/api/todo`;

export const Todo = ({
	todos,
	onChange,
	selectedDate,
	hpRemaining,
	setHpRemaining,
}: TodoProps) => {
	// const add = () => {
	//   const newTodo: TodoType = {
	//     id: Date.now(),
	//     exercise:"",
	//     text: "",
	//     weight: "",
	//     sets: 4,
	//     reps: 10,
	//     rating: 2,
	//     done: false,
	//   };
	//   onChange([...todos, newTodo]);
	// };
	const saveHpToBackend = async (newValue: number | null) => {
		const token = localStorage.getItem("token");
		if (!token || newValue == null) return;

		await fetch(`${API_BASE}/hp/${selectedDate}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ hpRemaining: newValue }),
		});
	};
	const navigate = useNavigate();
	const handleLogout = () => {
		localStorage.removeItem("token");
		navigate("/");
	};
	const add = async () => {
		const token = localStorage.getItem("token");
		if (!token) return;

		// create a local todo first
		const newTodo: TodoType = {
			id: Date.now(),
			exercise: "",
			text: "New todo",
			weight: "",
			sets: 4,
			reps: 10,
			rating: 0,
			done: false,
			date: selectedDate,
		};

		try {
			// send to backend
			const res = await fetch(API_BASE, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				//body: JSON.stringify(newTodo),
				body: JSON.stringify({
					...newTodo,
					date: selectedDate, // ✅ include this field for the backend
				}),
			});

			const data = await res.json();

			if (res.ok) {
				// use backend id if provided
				const savedTodo: TodoType = {
					...newTodo,
					id: data._id || newTodo.id,
				};

				// update UI
				onChange([...todos, savedTodo]);
			} else {
				console.error(data.error || "Failed to save todo");
			}
		} catch (err) {
			console.error("Error adding todo:", err);
		}
	};

	// const deleteTodo = (id: number) => {
	//   onChange(todos.filter((t) => t.id !== id));
	// };
	const deleteTodo = async (id: number) => {
		const token = localStorage.getItem("token");

		if (!token) return;

		try {
			await fetch(`${API_BASE}/${id}`, {
				method: "DELETE",
				headers: { Authorization: `Bearer ${token}` },
			});
		} catch (err) {
			console.error("Error deleting todo:", err);
		}

		// always remove from UI
		onChange(todos.filter((t) => t.id !== id));
	};

	//   const updateTodo = (id: number, updated: TodoType) => {
	//   onChange(todos.map((t) => (t.id === id ? updated : t)));
	// };
	const updateTodo = async (id: number, updated: TodoType) => {
		onChange(todos.map((t) => (t.id === id ? updated : t))); // instant local update

		const token = localStorage.getItem("token");
		if (!token) return;

		try {
			await fetch(`${API_BASE}/${id}`, {
				method: "PATCH", // <-- we'll add this route in backend soon if not present
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					...updated,
					date: selectedDate, // ✅ ensure correct association in DB
				}),
			});
		} catch (err) {
			console.error("Error updating todo:", err);
		}
	};

	return (
		<>
			<div className="todoFixWrap">
				<div className="todoBtnWrap">
					<button className="todoBtn" onClick={add}>
						Add
					</button>
					<button className="todoBtn">Share</button>
					<button className="todoBtn" onClick={handleLogout}>
						Logout
					</button>
				</div>

				<div className="hpCheck">
					<span>
						Stay consistent. Stay strong. Every rep counts{" "}
						<FavoriteIcon
							fontSize="inherit"
							sx={{ color: "#ff6d75" }}
						/>
					</span>
					{/* <StyledRating
            name="customized-color"
            defaultValue={2}
            precision={0.5}
            icon={<FavoriteIcon fontSize="inherit" />}
            emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
          /> */}
					{/* <StyledRating
  name="hp-remaining"
  value={hpRemaining}
  onChange={(_, newValue) => {
    setHpRemaining(newValue);
    saveHpToBackend(newValue); // optional step 2
  }}
  precision={0.5}
  icon={<FavoriteIcon fontSize="inherit" />}
  emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
/> */}
				</div>
			</div>

			<div className="listBody">
				{/* {todos.map((todo, index) => (
          <TodoItem
            key={todo.id}
            text={todo.text || `Exercise ${index + 1}`}
            onDelete={() => deleteTodo(todo.id)}
          />
        ))} */}
				{todos.map((todo, index) => (
					<TodoItem
						key={todo.id}
						todo={todo}
						onUpdate={(updated) => updateTodo(todo.id, updated)}
						onDelete={() => deleteTodo(todo.id)}
					/>
				))}
			</div>
		</>
	);
};
