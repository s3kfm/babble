"use client";

import { useState } from "react";
import { AudioLines, PlusCircle } from "lucide-react";
import { useTaskStore } from "./store/task-store";
import AppHeader from "./components/app-header";
import QuickAddInput from "./components/quick-add-input";
import TaskSection from "./components/task-section";
import FloatingActionButton from "./components/floating-action-button";
import AddProjectForm from "./components/add-project-form";
import DeleteProjectModal from "./components/delete-project-modal";
import Babbler from "./components/babbler";

export default function App() {
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [deleteProjectName, setDeleteProjectName] = useState<string | null>(
    null,
  );

  const tasks = useTaskStore((state) => state.tasks);
  const projects = useTaskStore((state) => state.projects);
  const newTaskText = useTaskStore((state) => state.newTaskText);
  const selectedProject = useTaskStore((state) => state.selectedProject);
  const setNewTaskText = useTaskStore((state) => state.setNewTaskText);
  const setSelectedProject = useTaskStore((state) => state.setSelectedProject);
  const toggleTask = useTaskStore((state) => state.toggleTask);
  const addTask = useTaskStore((state) => state.addTask);
  const addProject = useTaskStore((state) => state.addProject);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const deleteProject = useTaskStore((state) => state.deleteProject);

  const [isBabbling, setIsBabbling] = useState(false);
  const [deepgramToken, setDeepgramToken] = useState<string | null>(null);
  const startBabbling = async () => {
    const json = await fetch("/deepgram").then((response) => {
      if (!response.ok) throw new Error("Error GEtting Token");
      return response.json();
    });
    setDeepgramToken(json.access_token);
    setIsBabbling(true);
  };

  const handleAddTask = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    addTask();
  };

  const handleAddProject = (projectName: string) => {
    addProject(projectName);
  };

  const handleDeleteProjectClick = (projectName: string) => {
    // Get all tasks for this project (including completed ones)
    const projectTasks = tasks.filter((t) => t.project === projectName);

    // If no tasks, delete immediately without confirmation
    if (projectTasks.length === 0) {
      deleteProject(projectName);
    } else {
      // Show modal for confirmation
      setDeleteProjectName(projectName);
    }
  };

  const handleConfirmDelete = (reassignToProject?: string) => {
    if (deleteProjectName) {
      deleteProject(deleteProjectName, reassignToProject);
      setDeleteProjectName(null);
    }
  };

  return (
    <div
      className="min-h-screen bg-base-100 flex flex-col font-sans"
      data-theme="velocity"
    >
      <AppHeader />

      {/* Main Content */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 pt-6 pb-24">
        <div>
          <h1 className="text-2xl bold">What is babble?</h1>
          <div className="alert alert-primary ">
            Based on Todoist ramble feature, this tech demo uses AI and deepgram
            to allow you to break a string of thoughts (babble) into tasks.
            Speak Tasks, ask the AI to update tasks or just speak your mind and
            it will break down your thoughts into action items. You can keep
            talking as long as you like and it will keep breaking your thoughts
            down.
          </div>
        </div>
        <div className=" p-2 border border-secondary rounded my-4">
          {isBabbling && deepgramToken && (
            <Babbler
              onStop={() => {
                setIsBabbling(false);
                setDeepgramToken(null);
              }}
              token={deepgramToken}
            ></Babbler>
          )}
          {!isBabbling && (
            <div className="flex justify-between items-center">
              <div className="text-sm">Click to start babbling</div>
              <button className="btn-secondary btn" onClick={startBabbling}>
                <AudioLines size={24} />
                Babble
              </button>
            </div>
          )}
        </div>
        <QuickAddInput
          value={newTaskText}
          onChange={setNewTaskText}
          onSubmit={handleAddTask}
          projects={projects}
          selectedProject={selectedProject}
          onProjectChange={setSelectedProject}
        />

        {/* Task Sections */}
        <div className="space-y-10">
          {projects.map((project) => {
            const projectTasks = tasks.filter(
              (t) => (t.project || "General") === project,
            );

            return (
              <TaskSection
                key={project}
                project={project}
                tasks={projectTasks}
                onToggleTask={toggleTask}
                onDeleteTask={deleteTask}
                onDeleteProject={handleDeleteProjectClick}
              />
            );
          })}
        </div>

        {/* Add Project Button */}
        <button
          onClick={() => setIsProjectFormOpen(true)}
          className="btn btn-primary mt-2"
        >
          <PlusCircle size={20} />
          Add Project
        </button>
      </main>

      <FloatingActionButton />

      {/* Add Project Form Modal */}
      <AddProjectForm
        isOpen={isProjectFormOpen}
        onClose={() => setIsProjectFormOpen(false)}
        onAddProject={handleAddProject}
      />

      {/* Delete Project Modal */}
      {deleteProjectName && (
        <DeleteProjectModal
          isOpen={!!deleteProjectName}
          onClose={() => setDeleteProjectName(null)}
          projectName={deleteProjectName}
          taskCount={
            tasks.filter((t) => t.project === deleteProjectName).length
          }
          projects={projects}
          onConfirmDelete={handleConfirmDelete}
        />
      )}
    </div>
  );
}
