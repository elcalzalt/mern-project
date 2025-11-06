import React from "react";
import "./Feature.css"; // optional if styling is shared
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Typography from "@mui/material/Typography";
import ExerciseList from "./ExerciseList";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import NativeSelect from "@mui/material/NativeSelect";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";

type TodoItemProps = {
  text: string;
  onDelete: () => void;
};
const label = { slotProps: { input: { 'aria-label': 'Checkbox demo' } } };
export const TodoItem = ({ text, onDelete }: TodoItemProps) => {
  const [value, setValue] = React.useState<number | null>(2);
  return (
    <div className="todoItem">
      <div className="exerciseNum">
        <div className="exerciseNumRow">
         {text}
        <Rating
          name="simple-controlled"
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        />
        </div>
        <div style={{display:"flex", alignItems:"center"}}>
          <Checkbox {...label} />
           <button onClick={onDelete} className="deleteBtn">❌</button>
        </div>
       
      </div>
      <div className="contentRow">
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            //justifyContent:"center",
            gap: "10px",
          }}
        >
          <ExerciseList />
          <TextField id="outlined-basic" label="Weights" variant="outlined" sx={{ width: "21%" }}/>
          <FormControl sx={{ width: "12%" }}>
            <InputLabel variant="standard" htmlFor="uncontrolled-native">
              Sets
            </InputLabel>
            <NativeSelect
              defaultValue={4}
              inputProps={{
                name: "sets",
                id: "uncontrolled-native",
              }}
            >
              {Array.from({ length: 6 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </NativeSelect>
          </FormControl>
          <FormControl sx={{ width: "14%" }}>
            <InputLabel variant="standard" htmlFor="uncontrolled-native">
              Reps
            </InputLabel>
            <NativeSelect
              defaultValue={10}
              inputProps={{
                name: "reps",
                id: "uncontrolled-native",
              }}
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </NativeSelect>
          </FormControl>
          
        </Box>
      </div>
    </div>
  );
};
