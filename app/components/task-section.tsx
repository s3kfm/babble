"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Trash2 } from "lucide-react";
import { Task } from "../types/task";
import TaskItem from "./task-item";

interface TaskSectionProps {
  project: string;
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onDeleteProject?: (project: string) => void;
}

export default function TaskSection({
  project,
  tasks,
  onToggleTask,
  onDeleteTask,
  onDeleteProject,
}: TaskSectionProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section>
      <div
        className="flex items-center justify-between border-b border-base-300 pb-2 mb-4 group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-bold text-neutral">{project}</h3>

          {isHovered && onDeleteProject && project !== "General" && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => onDeleteProject(project)}
              className="btn btn-ghost btn-xs btn-circle text-error hover:bg-error/10"
              aria-label={`Delete ${project} project`}
            >
              <Trash2 size={14} />
            </motion.button>
          )}
        </div>
        <span className="badge badge-ghost border-none bg-base-300 text-neutral font-bold rounded-full h-6 w-6 p-0 flex items-center justify-center">
          {tasks.length}
        </span>
      </div>

      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {tasks.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-secondary/50 italic py-2"
            >
              No tasks in {project}
            </motion.p>
          ) : (
            tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={onToggleTask}
                onDelete={onDeleteTask}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
