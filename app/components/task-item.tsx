"use client";

import { motion } from "motion/react";
import { Check, Trash2 } from "lucide-react";
import { Task } from "../types/task";

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <motion.div
      key={task.id}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group flex items-center justify-between bg-white border border-base-300 p-3 rounded-lg hover:bg-base-200 transition-colors cursor-pointer"
      onClick={() => onToggle(task.id)}
    >
      <div className="flex items-center gap-4 flex-1">
        <div
          className={`
          w-6 h-6 border-2 rounded flex items-center justify-center transition-all
          ${task.completed ? "bg-primary border-primary" : "border-secondary/30"}
        `}
        >
          {task.completed && <Check size={14} className="text-white" />}
        </div>
        <span
          className={`
          transition-all font-medium
          ${task.completed ? "line-through text-secondary/50" : "text-neutral"}
        `}
        >
          {task.text}
        </span>
      </div>

      <button
        className="opacity-0 group-hover:opacity-100 btn btn-ghost btn-xs btn-circle transition-opacity hover:bg-error/10"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(task.id);
        }}
      >
        <Trash2 size={16} className="text-error" />
      </button>
    </motion.div>
  );
}
