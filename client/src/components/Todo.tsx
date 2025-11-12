
import React from "react";
import "./Feature.css";
import { TodoItem } from "./todoItem";
import { styled } from "@mui/material/styles";
import Rating from "@mui/material/Rating";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import { Dialog, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import { exportToPDF, exportToImage } from "./ExportUtils";
import { useState } from "react";

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
  const [openShare, setOpenShare] = useState(false);
  const handleOpenShare = () => setOpenShare(true);
  const handleCloseShare = () => setOpenShare(false);

  return (
    <>
      <Dialog
        open={openShare}
        onClose={handleCloseShare}
        fullWidth
        maxWidth="md"
      >
        <DialogContent>
          <div id="share-preview" className="exportWrap" style={{ }}>
            <h2 style={{ textAlign: "center", marginBottom: 16 }}>
              My Workout Summary 🏋️‍♂️
            </h2>
            <div className="exportWeight">
              <span>Today's Weight: </span>
			 <input type="text" placeholder="lbs" style={{padding:"10px", width: "25%",height:"50px", overflow:"visible",fontSize:"16px"}} />
			<span>lbs</span>
		    </div>
            <div>
              {todos.map((todo) => (
                <div
                  key={todo.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderBottom: "1px solid #ddd",
                    padding: "8px 0",
                  }}
                >
                  <span style={{width:"30%", whiteSpace:"wrap"}}>{todo.exercise || "Exercise"}</span>
                  <span style={{width:"80px"}}>{todo.weight} lbs</span>
                  <span style={{width:"40px"}}>
                    {todo.sets}x{todo.reps}
                  </span>
                  <span style={{width:"40px"}}>⭐ {todo.rating}</span>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => exportToPDF("share-preview")}>
            Export as PDF
          </Button>
          <Button onClick={() => exportToImage("share-preview")}>
            Export as Image
          </Button>
          <Button onClick={handleCloseShare}>Close</Button>
        </DialogActions>
      </Dialog>

      <div className="todoFixWrap">
        <div className="todoBtnWrap">
          <button className="todoBtn" onClick={add}>
            Add
          </button>
          <button className="todoBtn" onClick={handleOpenShare}>
            Share
          </button>

          <button className="todoBtn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className="hpCheck">
          <span>
            Stay consistent. Stay strong. Every rep counts{" "}
            <FavoriteIcon fontSize="inherit" sx={{ color: "#ff6d75" }} />
          </span>
        </div>
      </div>

      <div className="listBody">
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
