export interface Task {
  id: string;
  text: string;
  completed: boolean;
  project: string;
}

export const INITIAL_TASKS: Task[] = [
  {
    id: "1",
    text: "Finish Q3 Roadmap Presentation",
    completed: false,
    project: "Work",
  },
  {
    id: "2",
    text: "Review design system updates",
    completed: false,
    project: "Work",
  },
  { id: "3", text: "Call Doctor", completed: false, project: "Personal" },
];
