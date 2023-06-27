import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import AuthContextProvider from "./contexts/AuthContext";
import IncubationContextProvider from "./contexts/IncubationContext";
import DHTContextProvider from "./contexts/DHTContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <DHTContextProvider>
      <IncubationContextProvider>
        <AuthContextProvider>
          <App />
        </AuthContextProvider>
      </IncubationContextProvider>
    </DHTContextProvider>
  </React.StrictMode>
);
