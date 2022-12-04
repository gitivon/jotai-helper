import { Provider } from "jotai";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { useAtomsDebugValue } from "jotai/devtools";

const DebugAtoms = () => {
  useAtomsDebugValue();
  return null;
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <DebugAtoms />
    <App />
  </React.StrictMode>
);
