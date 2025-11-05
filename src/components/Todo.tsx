import React, { useState } from "react";
import "./Feature.css";
import { TodoItem } from "./todoItem";
import { styled } from "@mui/material/styles";
import Rating from "@mui/material/Rating";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const StyledRating = styled(Rating)({
  "& .MuiRating-iconFilled": {
    color: "#ff6d75",
  },
  "& .MuiRating-iconHover": {
    color: "#ff3d47",
  },
});
export const Todo = () => {
  const [todos, setTodos] = useState<string[]>([]);

  const add = () => {
    setTodos([...todos, `Exercise ${todos.length + 1}`]);
  };
  return (
    <>
      <div className="todoFixWrap">
        <div className="todoBtnWrap">
          <button className="todoBtn" onClick={add}>
            Add
          </button>
          <button className="todoBtn"> Share</button>
          <button className="todoBtn"> Compare </button>
        </div>
        <div className="hpCheck">
          <span>HP remaining after training: </span>
          <StyledRating
            name="customized-color"
            defaultValue={2}
            getLabelText={(value: number) =>
              `${value} Heart${value !== 1 ? "s" : ""}`
            }
            precision={0.5}
            icon={<FavoriteIcon fontSize="inherit" />}
            emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
          />
        </div>
      </div>

      <div className="listBody" id="body">
        {todos.map((todo: string, index: number) => (
          <TodoItem key={index} text={todo} />
        ))}
      </div>
    </>
  );
};
