import React from "react";
import "./Feature.css"; // optional if styling is shared
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Typography from "@mui/material/Typography";

export const TodoItem = ({ text }: { text: string }) => {
  const [value, setValue] = React.useState<number | null>(2);
  return (
    <div className="todoItem">
       <div className="exerciseNum">{text}</div>

      <div>
        <Rating
          name="simple-controlled"
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        />
      </div>
    </div>
  );
};
