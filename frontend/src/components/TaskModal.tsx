
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { TaskStatus, TaskPriority, Task } from "@/types/task";
import { TaskModalProps } from "@/types/task";


export default function TaskModal({ isOpen, onClose, task, onSave }: TaskModalProps) {
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    due_date: string;
    status: TaskStatus;
    priority: TaskPriority;
  }>({
    title: "",
    description: "",
    due_date: "",
    status: "todo",
    priority: 0,
  });

  // Reset form when modal opens/closes or task changes
  useEffect(() => {
    if (isOpen) {
      if (task) {
        setFormData({
          title: task.title,
          description: task.description || "",
          due_date: task.due_date ? new Date(task.due_date).toISOString().slice(0, 16) : "",
          status: task.status,
          priority: task.priority,
        });
      } else {
        setFormData({
          title: "",
          description: "",
          due_date: "",
          status: "todo",
          priority: 0,
        });
      }
    }
  }, [isOpen, task]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "priority" ? Number.parseInt(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      due_date: formData.due_date ? new Date(formData.due_date).toISOString() : null,
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 20 }}
          className="bg-[#0a0a0a] border border-white/10 rounded-xl w-full max-w-md p-6 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">{task ? "Edit Task" : "Create Task"}</h2>
            <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-white/70 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500/50 transition-all"
                  placeholder="Task title"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-white/70 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500/50 transition-all resize-none"
                  placeholder="Task description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="due_date" className="block text-sm font-medium text-white/70 mb-2">
                    Due Date
                  </label>
                  <input
                    type="datetime-local"
                    id="due_date"
                    name="due_date"
                    value={formData.due_date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500/50 transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-white/70 mb-2">
                    Priority
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500/50 transition-all"
                  >
                    <option value={0}>Low</option>
                    <option value={1}>Medium</option>
                    <option value={2}>High</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-white/70 mb-2">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500/50 transition-all"
                >
                  <option value="todo">To Do</option>
                  <option value="inprogress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-white/10 rounded-lg text-white/70 hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
                >
                  {task ? "Update Task" : "Create Task"}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}