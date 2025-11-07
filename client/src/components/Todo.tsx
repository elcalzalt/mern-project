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

export type TodoType = {
  id: number;
  exercise: string;
  text: string;        // exercise name
  weight: string;
  sets: number;
  reps: number;
  rating: number;
  done: boolean;
};

type TodoProps = {
  todos: TodoType[];
  onChange: (newTodos: TodoType[]) => void;
};

const StyledRating = styled(Rating)({
  "& .MuiRating-iconFilled": {
    color: "#ff6d75",
  },
  "& .MuiRating-iconHover": {
    color: "#ff3d47",
  },
});

export const Todo = ({ todos, onChange }: TodoProps) => {
  const add = () => {
    const newTodo: TodoType = {
      id: Date.now(),
      exercise:"",
      text: "",
      weight: "",
      sets: 4,
      reps: 10,
      rating: 2,
      done: false,
    };
    onChange([...todos, newTodo]);
  };

  const deleteTodo = (id: number) => {
    onChange(todos.filter((t) => t.id !== id));
  };
    const updateTodo = (id: number, updated: TodoType) => {
    onChange(todos.map((t) => (t.id === id ? updated : t)));
  };

  return (
    <>
      <div className="todoFixWrap">
        <div className="todoBtnWrap">
          <button className="todoBtn" onClick={add}>Add</button>
          <button className="todoBtn">Share</button>
          <button className="todoBtn">Compare</button>
        </div>

        <div className="hpCheck">
          <span>HP remaining after training: </span>
          <StyledRating
            name="customized-color"
            defaultValue={2}
            precision={0.5}
            icon={<FavoriteIcon fontSize="inherit" />}
            emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
          />
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
