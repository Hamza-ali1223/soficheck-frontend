import React from "react";
import ReactDOM from "react-dom/client";
import { HeroUIProvider } from "@heroui/system";
import { SpeedInsights } from "@vercel/speed-insights/react";

import App from "./App.tsx";
import "@/styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HeroUIProvider>
      <App />
      <SpeedInsights />
    </HeroUIProvider>
  </React.StrictMode>,
);
