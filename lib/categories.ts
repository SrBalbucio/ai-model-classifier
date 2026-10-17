import type { Category } from "./types";

export const CATEGORIES: Category[] = [
  {
    id: "autonomy",
    label: "Autonomy",
    description:
      "Can work through a task on its own without constant hand-holding or check-ins.",
    color: "#5eead4",
    inverted: false,
    external: null,
  },
  {
    id: "speed",
    label: "Speed",
    description: "How fast it feels to work with — tokens out, low latency, quick turnarounds.",
    color: "#818cf8",
    inverted: false,
    external: null,
  },
  {
    id: "reasoning",
    label: "Reasoning",
    description: "Quality of logical reasoning, deduction and multi-step problem solving.",
    color: "#c084fc",
    inverted: false,
    external: "intelligence_index",
  },
  {
    id: "task_completion",
    label: "Task Completion",
    description: "Takes a task from start to finish without losing the thread or stalling.",
    color: "#f472b6",
    inverted: false,
    external: "agentic_index",
  },
  {
    id: "tool_use",
    label: "Tools / MCP",
    description: "Using tools, function calling and MCP servers correctly and reliably.",
    color: "#fb923c",
    inverted: false,
    external: null,
  },
  {
    id: "context_window",
    label: "Context Window",
    description: "How much context it can hold before losing track of earlier information.",
    color: "#facc15",
    inverted: false,
    external: "context_length",
  },
  {
    id: "cost",
    label: "Cost",
    description: "Value for money. Higher = cheaper / better priced.",
    color: "#34d399",
    inverted: true,
    external: "price",
  },
  {
    id: "hallucination",
    label: "Hallucinations",
    description: "How often it makes things up. Higher = fewer hallucinations.",
    color: "#f87171",
    inverted: true,
    external: null,
  },
  {
    id: "multilingual",
    label: "Multilingual",
    description:
      "Understands languages beyond English and replies correctly in the language you ask.",
    color: "#38bdf8",
    inverted: false,
    external: null,
  },
];

export const CATEGORY_MAP: Record<string, Category> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
);
