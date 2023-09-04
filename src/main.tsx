import { StrictMode } from "react"

import { createRoot } from "react-dom/client"
import { CONFIG } from "yaasl/core"

import App from "./App"

import "./index.css"

CONFIG.name = "gridwid"

const root = document.getElementById("root")
if (!root) throw new Error("Root node could not be found")

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
)
