import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";

const filter = createFilterOptions<ExerciseOptionType>();
type ExerciseListProps = {
  value: string;
  onChange: (newValue: string) => void;
};

export default function ExerciseList({ value, onChange }: ExerciseListProps) {
  const [options, setOptions] = React.useState<ExerciseOptionType[]>(top100Exercises);
  const [internalValue, setInternalValue] = React.useState<ExerciseOptionType | null>(
    value ? { name: value } : null
  );

  React.useEffect(() => {
    setInternalValue(value ? { name: value } : null);
  }, [value]);

  return (
    <Autocomplete
      value={internalValue}
      onChange={(_, newValue) => {
        let name = "";
        if (typeof newValue === "string") name = newValue;
        else if (newValue?.inputValue) name = newValue.inputValue;
        else if (newValue) name = newValue.name;

        onChange(name);
        setInternalValue({ name });
        if (!options.some((o) => o.name === name)) setOptions([...options, { name }]);
      }}
      options={options}
      getOptionLabel={(option) => (typeof option === "string" ? option : option.name)}
      renderInput={(params) => <TextField {...params} label="Exercise name" />}
      sx={{ width: "40%" }}
      freeSolo
    />
  );
}

// export default function FreeSoloCreateOption() {
//   const [value, setValue] = React.useState<ExerciseOptionType | null>(null);

//   // Use state for options so we can add new exercises dynamically
//   const [options, setOptions] =
//     React.useState<ExerciseOptionType[]>(top100Exercises);

//   return (
//     <Autocomplete
//       value={value}
//       onChange={(_, newValue) => {
//         if (typeof newValue === "string") {
//           const newOption = { name: newValue };
//           setValue(newOption);
//           setOptions((prev) => [...prev, newOption]); // add to options
//         } else if (newValue && newValue.inputValue) {
//           const newOption = { name: newValue.inputValue };
//           setValue(newOption);
//           setOptions((prev) => [...prev, newOption]); // add to options
//         } else {
//           setValue(newValue);
//         }
//       }}
//       filterOptions={(options, params) => {
//         const filtered = filter(options, params);
//         const { inputValue } = params;
//         const isExisting = options.some((option) => inputValue === option.name);
//         if (inputValue !== "" && !isExisting) {
//           filtered.push({
//             inputValue,
//             name: `Add "${inputValue}"`,
//           });
//         }
//         return filtered;
//       }}
//       selectOnFocus
//       clearOnBlur
//       handleHomeEndKeys
//       id="free-solo-with-text-demo"
//       options={options} // <-- use state array
//       getOptionLabel={(option) => {
//         if (typeof option === "string") return option;
//         if (option.inputValue) return option.inputValue;
//         return option.name;
//       }}
//       renderOption={(props, option) => {
//         const { key, ...optionProps } = props;
//         return (
//           <li key={key} {...optionProps}>
//             {option.name}
//           </li>
//         );
//       }}
//       sx={{ width: "40%" }}
//       freeSolo
//       renderInput={(params) => <TextField {...params} label="Exercise name" />}
//     />
//   );
// }

interface ExerciseOptionType {
  inputValue?: string;
  name: string;
}

// Top 100 popular exercises
const top100Exercises: ExerciseOptionType[] = [
  { name: "Push-ups" },
  { name: "Squats" },
  { name: "Lunges" },
  { name: "Plank" },
  { name: "Burpees" },
  { name: "Bicep Curls" },
  { name: "Bench Press" },
  { name: "Deadlift" },
  { name: "Pull-ups" },
  { name: "Chin-ups" },
  { name: "Shoulder Press" },
  { name: "Tricep Dips" },
  { name: "Mountain Climbers" },
  { name: "Leg Press" },
  { name: "Leg Curl" },
  { name: "Leg Extension" },
  { name: "Chest Fly" },
  { name: "Incline Bench Press" },
  { name: "Decline Bench Press" },
  { name: "Lat Pulldown" },
  { name: "Seated Row" },
  { name: "Russian Twists" },
  { name: "Sit-ups" },
  { name: "Crunches" },
  { name: "Hanging Leg Raise" },
  { name: "Glute Bridge" },
  { name: "Hip Thrust" },
  { name: "Cable Kickback" },
  { name: "Dumbbell Fly" },
  { name: "Arnold Press" },
  { name: "Lateral Raise" },
  { name: "Front Raise" },
  { name: "Face Pull" },
  { name: "Overhead Tricep Extension" },
  { name: "Hammer Curl" },
  { name: "Concentration Curl" },
  { name: "Preacher Curl" },
  { name: "Incline Dumbbell Curl" },
  { name: "Farmer's Walk" },
  { name: "Jumping Jacks" },
  { name: "Box Jump" },
  { name: "High Knees" },
  { name: "Butt Kickers" },
  { name: "Side Plank" },
  { name: "Reverse Crunch" },
  { name: "Bicycle Crunch" },
  { name: "V-ups" },
  { name: "Superman" },
  { name: "Good Morning" },
  { name: "Sumo Deadlift" },
  { name: "Romanian Deadlift" },
  { name: "Front Squat" },
  { name: "Goblet Squat" },
  { name: "Step-ups" },
  { name: "Calf Raise" },
  { name: "Leg Kickbacks" },
  { name: "Incline Push-ups" },
  { name: "Decline Push-ups" },
  { name: "Diamond Push-ups" },
  { name: "Spiderman Push-ups" },
  { name: "Pike Push-ups" },
  { name: "Chest Press Machine" },
  { name: "Cable Crossover" },
  { name: "Dumbbell Row" },
  { name: "Inverted Row" },
  { name: "Pull-over" },
  { name: "T-bar Row" },
  { name: "Lat Raise Machine" },
  { name: "Shrugs" },
  { name: "Reverse Fly" },
  { name: "Tricep Pushdown" },
  { name: "Rope Pushdown" },
  { name: "Skull Crusher" },
  { name: "Kettlebell Swing" },
  { name: "Turkish Get-up" },
  { name: "Clean and Press" },
  { name: "Snatch" },
  { name: "Thrusters" },
  { name: "Push Press" },
  { name: "Overhead Squat" },
  { name: "Wall Sit" },
  { name: "Side Lunges" },
  { name: "Curtsy Lunges" },
  { name: "Glute Kickbacks" },
  { name: "Jump Squats" },
  { name: "Broad Jump" },
  { name: "Bear Crawl" },
  { name: "Crab Walk" },
  { name: "Medicine Ball Slam" },
  { name: "Battle Ropes" },
  { name: "Jump Rope" },
  { name: "Sprint" },
  { name: "Hill Sprints" },
  { name: "Agility Ladder Drills" },
  { name: "Side Shuffle" },
  { name: "Cone Drills" },
  { name: "Boxing Jab-Cross Combo" },
  { name: "Kickboxing Front Kick" },
  { name: "Mountain Climber Twist" },
  { name: "Plank Shoulder Tap" },
  { name: "Bear Plank Shoulder Tap" },
  { name: "Hip Bridge March" },
  { name: "Side-Lying Leg Lift" },
  { name: "Clamshell" },
  { name: "Donkey Kick" },
  { name: "Fire Hydrant" },
];
