import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from 'uuid';

export type DayOfWeek =
  "Monday" | "Tuesday" | "Wednesday" |
  "Thursday" | "Friday" | "Saturday" | "Sunday";

export interface Habit {
  id: string;
  name: string;
  frequency: "daily" | "weekly";
  completedDates: string[];
  createdAt: string;
  lastNotified?: string;
}

interface HabitState {
  habits: Habit[];
  isLoading: boolean;
  error: string | null;
}

const loadHabitsFromLocalStorage = (): Habit[] => {
  try {
    const habits = localStorage.getItem("habits");
    return habits ? JSON.parse(habits) : [];
  } catch (error) {
    console.error("Error loading habits from localStorage:", error);
    return [];
  }
};

const saveHabitsToLocalStorage = (habits: Habit[]) => {
  localStorage.setItem("habits", JSON.stringify(habits));
};

const initialState: HabitState = {
  habits: loadHabitsFromLocalStorage(),
  isLoading: false,
  error: null,
};

export const fetchHabits = createAsyncThunk("habits/fetchHabits", async () => {
  // If you are using real API call replace this with real API call
  // await new Promise((resolve) => setTimeout(resolve, 1000));  // Remove timeout if not needed
  // const mockHabits: Habit[] = []; // Remove mock data if not needed
  // return mockHabits;
  return []; // Return empty array if no habits are fetched
});

const habitSlice = createSlice({
  name: "habits",
  initialState,
  reducers: {
    addHabit: (state, action: PayloadAction<{
      name: string;
      frequency: "daily" | "weekly";
      notificationEnabled: boolean;
      notificationTime?: string;
      notificationDay?: DayOfWeek;
    }>) => {
      const newHabit: Habit = {
        id: uuidv4(),
        name: action.payload.name,
        frequency: action.payload.frequency,
        completedDates: [],
        createdAt: new Date().toISOString(),
      };
      state.habits.push(newHabit);
      saveHabitsToLocalStorage(state.habits);
    },
    removeHabit: (state, action: PayloadAction<string>) => {
      state.habits = state.habits.filter(
        (habit) => habit.id !== action.payload
      );
      saveHabitsToLocalStorage(state.habits);
    },
    toggleHabit: (state, action: PayloadAction<{ id: string; date: string }>) => {
      const habit = state.habits.find((h) => h.id === action.payload.id);
      if (habit) {
        const index = habit.completedDates.indexOf(action.payload.date);
        if (index > -1) {
          habit.completedDates.splice(index, 1);
        } else {
          habit.completedDates.push(action.payload.date);
        }
        saveHabitsToLocalStorage(state.habits);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHabits.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchHabits.fulfilled, (state, action: PayloadAction<Habit[]>) => {
        state.isLoading = false;
        state.habits = [...state.habits, ...action.payload]; // Or state.habits = action.payload if replacing
        saveHabitsToLocalStorage(state.habits);
      })
      .addCase(fetchHabits.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch habits";
      });
  },
});

export const { addHabit, removeHabit, toggleHabit } = habitSlice.actions;

export default habitSlice.reducer;