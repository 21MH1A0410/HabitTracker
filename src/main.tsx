import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store/store";
import './index.css'; // Keep if you're using CSS

// Get the root element.  It's good practice to check if it exists.
const root = document.getElementById("root");

if (root) {
  const reactRoot = ReactDOM.createRoot(root); // Create a React root

  reactRoot.render(
    <React.StrictMode>  {/* Wrap with StrictMode for development */}
      <Provider store={store}> {/* Provide the Redux store */}
        <App /> {/* Your main application component */}
      </Provider>
    </React.StrictMode>
  );
} else {
  console.error("Root element not found in index.html"); // More descriptive error
  // Consider a fallback or error boundary here if the root is critical.
}
