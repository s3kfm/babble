"use client";

import { Plus } from "lucide-react";

interface QuickAddInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  projects: string[];
  selectedProject: string;
  onProjectChange: (project: string) => void;
}

export default function QuickAddInput({
  value,
  onChange,
  onSubmit,
  projects,
  selectedProject,
  onProjectChange,
}: QuickAddInputProps) {
  return (
    <form onSubmit={onSubmit} className="mb-8 space-y-3">
      <div className="flex items-center gap-3 bg-base-100 border border-base-300 rounded-lg px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
        <button
          type="submit"
          className="btn btn-secondary btn-sm btn-outline"
          disabled={!value || value.length === 0}
        >
          <Plus className="text-secondary" size={20} />
        </button>
        <input
          type="text"
          placeholder="Add a new task..."
          className="w-8/12 bg-transparent border-none outline-none text-base-content placeholder:text-secondary/50 font-medium h-10"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <select
          id="project-select"
          value={selectedProject}
          onChange={(e) => onProjectChange(e.target.value)}
          className="select w-4/12 select-sm select-bordered bg-base-100 border-base-300 text-base-content font-medium"
        >
          {projects.map((project) => (
            <option key={project} value={project}>
              {project}
            </option>
          ))}
        </select>
      </div>
    </form>
  );
}
