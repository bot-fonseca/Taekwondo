
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import { AdminProvider } from "./app/context/AdminContext.tsx";
  import { ThemeProvider } from "./app/context/ThemeContext.tsx";
  import "./styles/index.css";

  createRoot(document.getElementById("root")!).render(
    <ThemeProvider><AdminProvider><App /></AdminProvider></ThemeProvider>
  );
  