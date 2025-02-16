import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Paper, Typography, Box, LinearProgress } from "@mui/material";
import { AppDispatch, RootState } from "../store/store";
import { fetchHabits, Habit } from "../store/habit-slice";

const HabitStats: React.FC = () => {
  const { habits, isLoading, error } = useSelector(
    (state: RootState) => state.habits
  );
  const dispatch = useDispatch<AppDispatch>();

  // Fetch habits on component mount
  useEffect(() => {
    dispatch(fetchHabits());
  }, [dispatch]);

  // Calculate streaks using useMemo for optimization
  const streaks = useMemo(() => {
    const getStreak = (habit: Habit) => {
      let streak = 0;
      const currentDate = new Date();

      while (true) {
        const dateString = currentDate.toISOString().split("T")[0];
        if (habit.completedDates.includes(dateString)) {
          streak++;
          currentDate.setDate(currentDate.getDate() - 1);
        } else {
          break;
        }
      }

      return streak;
    };

    return habits.map((habit) => getStreak(habit));
  }, [habits]);

  // Calculate statistics
  const totalHabits = habits.length;
  const completedToday = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return habits.filter((habit) => habit.completedDates.includes(today)).length;
  }, [habits]);
  const longestStreak = useMemo(() => Math.max(...streaks, 0), [streaks]);

  // Loading state
  if (isLoading) {
    return (
      <Paper elevation={2} sx={{ p: 2, mt: 4 }}>
        <LinearProgress />
      </Paper>
    );
  }

  // Error state
  if (error) {
    return (
      <Paper elevation={2} sx={{ p: 2, mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Paper>
    );
  }

  // Empty state
  if (habits.length === 0) {
    return (
      <Paper elevation={2} sx={{ p: 2, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Habit Statistics
        </Typography>
        <Typography variant="body1" color="text.secondary">
          No habits found. Add a new habit to see statistics!
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={2} sx={{ p: 2, mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Habit Statistics
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Typography variant="body1">
          Total Habits: {totalHabits}
        </Typography>
        <Typography variant="body1">
          Completed Today: {completedToday}
        </Typography>
        <Typography variant="body1">
          Longest Streak: {longestStreak} days
        </Typography>
      </Box>
    </Paper>
  );
};

export default HabitStats;