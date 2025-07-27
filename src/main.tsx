import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import { isDevEnv } from "utils/is-dev-env"

import { App } from "./app"

const root = document.getElementById("root")
if (!root) throw new Error("No root element found")

if (isDevEnv) {
  document.title = document.title + " (local)"
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
)
