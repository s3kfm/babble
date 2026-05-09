"use client";

import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface DeleteProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
  taskCount: number;
  projects: string[];
  onConfirmDelete: (reassignToProject?: string) => void;
}

export default function DeleteProjectModal({
  isOpen,
  onClose,
  projectName,
  taskCount,
  projects,
  onConfirmDelete,
}: DeleteProjectModalProps) {
  const [action, setAction] = useState<"delete" | "reassign">("delete");
  const [selectedProject, setSelectedProject] = useState<string>("");

  const availableProjects = projects.filter((p) => p !== projectName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (action === "reassign" && !selectedProject) {
      return;
    }
    onConfirmDelete(action === "reassign" ? selectedProject : undefined);
    handleClose();
  };

  const handleClose = () => {
    setAction("delete");
    setSelectedProject("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-base-100 rounded-2xl shadow-2xl z-50 p-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="text-warning" size={24} />
                <h2 className="text-2xl font-bold text-neutral">
                  Delete Project
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="btn btn-ghost btn-sm btn-circle"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <p className="text-neutral mb-4">
                  You are about to delete the project{" "}
                  <strong>&quot;{projectName}&quot;</strong> which contains{" "}
                  <strong>{taskCount}</strong> task{taskCount !== 1 ? "s" : ""}.
                </p>

                <p className="text-neutral mb-4">
                  What would you like to do with the tasks?
                </p>

                {/* Radio Options */}
                <div className="space-y-3">
                  <label className="flex items-start gap-3 p-3 border border-base-300 rounded-lg cursor-pointer hover:bg-base-200 transition-colors">
                    <input
                      type="radio"
                      name="action"
                      value="delete"
                      checked={action === "delete"}
                      onChange={(e) => setAction(e.target.value as "delete")}
                      className="radio radio-primary mt-0.5"
                    />
                    <div>
                      <div className="font-medium text-neutral">
                        Delete all tasks
                      </div>
                      <div className="text-sm text-neutral/60">
                        Permanently remove all tasks in this project
                      </div>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 border border-base-300 rounded-lg cursor-pointer hover:bg-base-200 transition-colors">
                    <input
                      type="radio"
                      name="action"
                      value="reassign"
                      checked={action === "reassign"}
                      onChange={(e) => setAction(e.target.value as "reassign")}
                      className="radio radio-primary mt-0.5"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-neutral mb-2">
                        Reassign to another project
                      </div>
                      {action === "reassign" && (
                        <select
                          value={selectedProject}
                          onChange={(e) => setSelectedProject(e.target.value)}
                          className="select select-bordered w-full bg-base-200 focus:outline-none focus:ring-2 focus:ring-primary"
                          autoFocus
                        >
                          <option value="">Select a project...</option>
                          {availableProjects.map((project) => (
                            <option key={project} value={project}>
                              {project}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={handleClose}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-error"
                  disabled={action === "reassign" && !selectedProject}
                >
                  Delete Project
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
