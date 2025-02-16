import React from "react";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import store from "./store/store";
import AddHabitForm from "./components/add-habit-form";
import HabitList from "./components/habit-list";
import HabitStats from "./components/habit-stats";
import './App.css';
import { Box, Container, Typography } from "@mui/material";
const App: React.FC = () => {
  

  return (
    <Provider store={store}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Container maxWidth="md">
          <Box sx={{ my: 4 }}>
            <Typography variant="h2" component="h1" gutterBottom align="center">
              Habit Tracker
            </Typography>
            <AddHabitForm />
            <HabitList />
            <HabitStats />
          </Box>
        </Container>
        <ToastContainer />
      </LocalizationProvider>
    </Provider>
  );
};

export default App;