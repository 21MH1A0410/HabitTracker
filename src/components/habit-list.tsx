import React, { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Typography,
  Button,
  LinearProgress,
  Paper,
  Grid,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Habit, removeHabit, toggleHabit } from "../store/habit-slice";
import { RootState, AppDispatch } from "../store/store";

const HabitList: React.FC = () => {
  const habits = useSelector((state: RootState) => state.habits.habits);
  const dispatch = useDispatch<AppDispatch>();

  const today = new Date().toISOString().split("T")[0];

  // Optimize streak calculation with useMemo
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

  // Memoize streak calculation for each habit
  const habitStreaks = useMemo(() => {
    return habits.map((habit) => ({
      ...habit,
      streak: getStreak(habit),
    }));
  }, [habits]);

  // Empty state
  if (habits.length === 0) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6" color="text.secondary">
          No habits found. Add a new habit to get started!
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 4 }}>
      {habitStreaks.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          today={today}
          onToggle={() =>
            dispatch(toggleHabit({ id: habit.id, date: today }))
          }
          onRemove={() => dispatch(removeHabit(habit.id))}
        />
      ))}
    </Box>
  );
};

// Separate component for habit card
interface HabitCardProps {
  habit: Habit & { streak: number };
  today: string;
  onToggle: () => void;
  onRemove: () => void;
}

const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  today,
  onToggle,
  onRemove,
}) => {
  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Grid container alignItems="center">
        <Grid item xs={12} sm={6}>
          <Typography variant="h6">{habit.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {habit.frequency.charAt(0).toUpperCase() +
              habit.frequency.slice(1)}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Button
              variant="outlined"
              color={
                habit.completedDates.includes(today) ? "success" : "primary"
              }
              onClick={onToggle}
              startIcon={<CheckCircleIcon />}
            >
              {habit.completedDates.includes(today)
                ? "Completed"
                : "Mark Complete"}
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={onRemove}
              startIcon={<DeleteIcon />}
            >
              Remove
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2">
          Current Streak: {habit.streak} days
        </Typography>
        <LinearProgress
          variant="determinate"
          value={(habit.streak / 30) * 100}
          sx={{ mt: 1 }}
        />
        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
          {habit.streak}/30 days
        </Typography>
      </Box>
    </Paper>
  );
};

export default HabitList;