"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AddProjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProject: (projectName: string) => void;
}

export default function AddProjectForm({
  isOpen,
  onClose,
  onAddProject,
}: AddProjectFormProps) {
  const [projectName, setProjectName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (projectName.trim()) {
      onAddProject(projectName.trim());
      setProjectName("");
      onClose();
    }
  };

  const handleClose = () => {
    setProjectName("");
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
              <h2 className="text-2xl font-bold text-neutral">
                Add New Project
              </h2>
              <button
                onClick={handleClose}
                className="btn btn-ghost btn-sm btn-circle"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label
                  htmlFor="project-name"
                  className="block text-sm font-medium text-neutral mb-2"
                >
                  Project Name
                </label>
                <input
                  id="project-name"
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Enter project name..."
                  className="input input-bordered w-full bg-base-200 focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                />
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
                  className="btn btn-primary"
                  disabled={!projectName.trim()}
                >
                  Add Project
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
