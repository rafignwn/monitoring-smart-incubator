import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import AuthContextProvider from "./contexts/AuthContext";
import IncubationContextProvider from "./contexts/IncubationContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <IncubationContextProvider>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </IncubationContextProvider>
  </React.StrictMode>
);
