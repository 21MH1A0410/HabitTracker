import React, { useState } from "react";
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { addHabit} from "../store/habit-slice";

const AddHabitForm: React.FC = () => {
  const [name, setName] = useState("");
  const [frequency, setFrequency] = useState<"daily" | "weekly">("daily");

  const dispatch = useDispatch<AppDispatch>();
  const [error, setError] = useState("");


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      dispatch(
        addHabit({
          name,
          frequency,
          notificationEnabled: false
        })
      );
      setName("");
      setFrequency("daily");  //Reset notification Day
      setError(""); // Clear error
    } else {
      setError("Habit name cannot be empty");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg shadow-md"> {/* Added Tailwind classes */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }} className="space-y-4"> {/* Added Tailwind class */}
        <TextField
          label="Habit Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          className="mb-2" // Added Tailwind class
          error={!!error}
          helperText={error}
        />

        <FormControl fullWidth className="mb-2"> {/* Added Tailwind class */}
          <InputLabel>Frequency</InputLabel>
          <Select
            value={frequency}
            label="Frequency"
            onChange={(e) => setFrequency(e.target.value as "daily" | "weekly")}
          >
            <MenuItem value="daily">Daily</MenuItem>
            <MenuItem value="weekly">Weekly</MenuItem>
          </Select>
        </FormControl>

        

        <Button type="submit" variant="contained" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"> {/* Added Tailwind classes */}
          Add Habit
        </Button>
      </Box>
    </form>
  );
};

export default AddHabitForm;