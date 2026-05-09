import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Task, INITIAL_TASKS } from "../types/task";

interface TaskStore {
  tasks: Task[];
  projects: string[];
  newTaskText: string;
  selectedProject: string;
  setNewTaskText: (text: string) => void;
  setSelectedProject: (project: string) => void;
  addProject: (project: string) => void;
  toggleTask: (id: string) => void;
  addTask: () => Task;
  addTasks: (
    tasks: Array<{
      id?: string;
      text: string;
      completed?: boolean;
      project: string;
    }>,
  ) => void;
  deleteTask: (id: string) => void;
  deleteTasks: (ids: string[]) => void;
  updateTasks: (
    updates: Array<{
      id: string;
      text?: string;
      completed?: boolean;
      project?: string;
    }>,
  ) => void;
  deleteProject: (project: string, reassignToProject?: string) => void;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: INITIAL_TASKS,
      projects: ["General", "Work", "Personal"],
      newTaskText: "",
      selectedProject: "General",
      setNewTaskText: (text) => set({ newTaskText: text }),
      setSelectedProject: (project) => set({ selectedProject: project }),
      addProject: (project) => {
        set((state) => {
          if (!project.trim() || state.projects.includes(project.trim())) {
            return state;
          }
          return {
            projects: [...state.projects, project.trim()],
          };
        });
        return project.trim();
      },
      toggleTask: (id) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t,
          ),
        })),
      addTask: function addTask() {
        const state = get();
        const newTask: Task = {
          id: Math.random().toString(36).substr(2, 9),
          text: state.newTaskText,
          completed: false,
          project: state.selectedProject || "General",
        };
        set((state) => {
          if (!state.newTaskText.trim()) return state;

          return {
            tasks: [newTask, ...state.tasks],
            newTaskText: "",
          };
        });
        return newTask;
      },
      addTasks: (tasks) =>
        set((state) => {
          // Generate IDs for tasks that don't have them and ensure projects exist
          const tasksWithIds: Task[] = tasks.map((task) => ({
            id: task.id || Math.random().toString(36).substr(2, 9),
            text: task.text,
            completed: task.completed ?? false,
            project: task.project || "General",
          }));

          // Add new projects if they don't exist
          const newProjects = [...state.projects];
          tasksWithIds.forEach((task) => {
            if (!newProjects.includes(task.project)) {
              newProjects.push(task.project);
            }
          });

          return {
            tasks: [...tasksWithIds, ...state.tasks],
            projects: newProjects,
          };
        }),
      deleteTask: (id) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),
      deleteTasks: (ids) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => !ids.includes(t.id)),
        })),
      updateTasks: (updates) =>
        set((state) => {
          // Track new projects that need to be added
          const newProjects = [...state.projects];

          const updatedTasks = state.tasks.map((task) => {
            const update = updates.find((u) => u.id === task.id);
            if (!update) return task;

            const updatedTask = {
              ...task,
              ...(update.text !== undefined && { text: update.text }),
              ...(update.completed !== undefined && {
                completed: update.completed,
              }),
              ...(update.project !== undefined && { project: update.project }),
            };

            // Add new project if it doesn't exist
            if (update.project && !newProjects.includes(update.project)) {
              newProjects.push(update.project);
            }

            return updatedTask;
          });

          return {
            tasks: updatedTasks,
            projects: newProjects,
          };
        }),
      deleteProject: (project, reassignToProject) =>
        set((state) => {
          // Remove the project from the projects list
          const updatedProjects = state.projects.filter((p) => p !== project);

          // Handle tasks
          let updatedTasks = state.tasks;
          if (reassignToProject) {
            // Reassign tasks to another project
            updatedTasks = state.tasks.map((t) =>
              t.project === project ? { ...t, project: reassignToProject } : t,
            );
          } else {
            // Delete all tasks in the project
            updatedTasks = state.tasks.filter((t) => t.project !== project);
          }

          // Update selectedProject if it was the deleted project
          const updatedSelectedProject =
            state.selectedProject === project
              ? "General"
              : state.selectedProject;

          return {
            projects: updatedProjects,
            tasks: updatedTasks,
            selectedProject: updatedSelectedProject,
          };
        }),
    }),
    {
      name: "task-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
