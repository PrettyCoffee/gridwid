import { Github } from "lucide-react"

import { RepoWidget, RepoWidgetProps } from "./RepoWidget"
import { WidgetDefinition } from "../widgets"

export default {
  id: "github-repo" as const,
  name: "Repository overview",
  description: "GitHub repository information",
  icon: Github,
  component: RepoWidget,
} satisfies WidgetDefinition<RepoWidgetProps>
