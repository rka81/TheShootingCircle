import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Set title based on app name
document.title = "Netball Shooter - Track Your Practice";

createRoot(document.getElementById("root")!).render(<App />);
