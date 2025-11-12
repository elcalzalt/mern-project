
import "./Feature.css";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import ExerciseList from "./ExerciseList";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import NativeSelect from "@mui/material/NativeSelect";
import TextField from "@mui/material/TextField";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import type { TodoType } from "./Todo";
type TodoItemProps = {
  todo: TodoType;
  onUpdate: (updated: TodoType) => void;
  onDelete: () => void;
};

export const TodoItem = ({ todo, onUpdate, onDelete }: TodoItemProps) => {
  return (
    <div className="todoItem">
      <div className="exerciseNum">
        <div className="exerciseNumRow">
          <Rating
            name="simple-controlled"
            value={todo.rating}
            onChange={(_, newValue) =>
              onUpdate({ ...todo, rating: newValue ?? 0 })
            }
          />
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <button onClick={onDelete} className="deleteBtn">
            <HighlightOffOutlinedIcon />
          </button>
        </div>
      </div>

      <div className="contentRow">
        <Box
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <ExerciseList
            value={todo.exercise}
            onChange={(newExercise) =>
              onUpdate({ ...todo, exercise: newExercise })
            }
          />
          <TextField
            id="outlined-basic"
            label="lbs"
            variant="outlined"
            sx={{ width: "21%" }}
            value={todo.weight}
            onChange={(e) => onUpdate({ ...todo, weight: e.target.value })}
          />
          <FormControl sx={{ width: "12%" }}>
            <InputLabel variant="standard" htmlFor="sets-select">
              Sets
            </InputLabel>
            <NativeSelect
              id="sets-select"
              value={todo.sets}
              onChange={(e) =>
                onUpdate({ ...todo, sets: parseInt(e.target.value) })
              }
            >
              {Array.from({ length: 6 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </NativeSelect>
          </FormControl>
          <FormControl sx={{ width: "14%" }}>
            <InputLabel variant="standard" htmlFor="reps-select">
              Reps
            </InputLabel>
            <NativeSelect
              id="reps-select"
              value={todo.reps}
              onChange={(e) =>
                onUpdate({ ...todo, reps: parseInt(e.target.value) })
              }
            >
              {Array.from({ length: 100 }, (_, i) => (
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
