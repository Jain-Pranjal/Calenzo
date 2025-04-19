
"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Plus, Calendar, Clock, Edit, Trash2, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { TaskStatus, TaskPriority, Task } from "@/types/task";
import { UserProfile } from "@/types/users";
import { fetchUser } from "@/lib/api";
import { fetchTasks, createTask, updateTask, deleteTask } from "@/lib/api";
import TaskModal from "@/components/TaskModal";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tasks and user on mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          throw new Error("You are not logged in. Please log in.");
        }

        // Fetch user
        const userData = await fetchUser();
        setUser(userData);
        console.log('User data:', userData);

        // Fetch tasks
        const tasksData = await fetchTasks();
        setTasks(tasksData);
      } catch (err:any) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to load tasks and user data.");
        if (err.message.includes("401")) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Group tasks by status
  const tasksByStatus = {
    todo: tasks.filter((task) => task.status === "todo"),
    inprogress: tasks.filter((task) => task.status === "inprogress"),
    done: tasks.filter((task) => task.status === "done"),
  };

  // Handle drag and drop
  const handleDragEnd = async (result: any) => {
    const { source, destination } = result;

    // Dropped outside a droppable area
    if (!destination) return;

    // Same position
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    // Find the task that was dragged
    const taskId = Number.parseInt(result.draggableId);
    const taskIndex = tasks.findIndex((t) => t.id === taskId);

    if (taskIndex !== -1) {
      try {
        const updatedTask = { 
          ...tasks[taskIndex],
          status: destination.droppableId as TaskStatus,
        };
        
        // Update UI immediately for better UX
        const updatedTasks = [...tasks];
        updatedTasks[taskIndex] = updatedTask;
        setTasks(updatedTasks);
        
        // Send update to API
        await updateTask(taskId, updatedTask);
      } catch (err) {
        console.error("Failed to update task status:", err);
        // Revert the UI change on error
        const originalTasks = await fetchTasks();
        setTasks(originalTasks);
      }
    }
  };

  // Open modal for creating a new task
  const openCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  // Open modal for editing an existing task
  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  // Handle task deletion
  const handleDeleteTask = async (taskId: number) => {
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
      setDeleteConfirmation(null);
    } catch (err) {
      console.error("Failed to delete task:", err);
      setError("Failed to delete task. Please try again.");
    }
  };

  // Get priority badge color
  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 0:
        return "bg-gray-400";
      case 1:
        return "bg-yellow-500";
      case 2:
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  // Get priority label
  const getPriorityLabel = (priority: TaskPriority) => {
  switch (priority) {
    case 0:
      return "Low";
    case 1:
      return "Medium";
    case 2:
      return "High";
    default:
      return "Low";
  }
  };

  // Get status column color
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case "todo":
        return "from-cyan-500/20 to-cyan-500/5";
      case "inprogress":
        return "from-purple-500/20 to-purple-500/5";
      case "done":
        return "from-emerald-500/20 to-emerald-500/5";
      default:
        return "from-gray-500/20 to-gray-500/5";
    }
  };

  // Get status column title
  const getStatusTitle = (status: TaskStatus) => {
    switch (status) {
      case "todo":
        return "To Do";
      case "inprogress":
        return "In Progress";
      case "done":
        return "Done";
      default:
        return "Unknown";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#030303] text-white flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="w-8 h-8 border-2 border-t-teal-500 border-white/20 rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#030303] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <a href="/login" className="text-teal-400 hover:underline">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome message */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Welcome, {user?.username || "User"}</h1>
          <p className="text-white/50">Manage your tasks and stay productive</p>
        </motion.div>

        {/* Tasks board */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(["todo", "inprogress", "done"] as TaskStatus[]).map((status) => (
              <div key={status} className="flex flex-col h-full">
                <div className={cn("rounded-t-lg py-3 px-4 font-medium bg-gradient-to-b", getStatusColor(status))}>
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">{getStatusTitle(status)}</h2>
                    <span className="bg-white/10 text-white/80 text-xs px-2 py-1 rounded-full">
                      {tasksByStatus[status].length}
                    </span>
                  </div>
                </div>

                <Droppable droppableId={status}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={cn(
                        "flex-1 p-4 rounded-b-lg bg-white/[0.02] backdrop-blur-sm border border-white/[0.05] min-h-[400px]",
                        snapshot.isDraggingOver && "bg-white/[0.04]"
                      )}
                    >
                      {tasksByStatus[status].length === 0 ? (
                        <div className="h-full flex items-center justify-center text-white/30 text-sm italic">
                          No tasks
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {tasksByStatus[status].map((task, index) => (
                            <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={cn(
                                    "bg-white/[0.03] border border-white/[0.08] rounded-lg p-4 shadow-sm",
                                    snapshot.isDragging && "shadow-lg ring-2 ring-teal-500/30"
                                  )}
                                >
                                  <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-medium text-white/90">{task.title}</h3>
                                    <div className="flex space-x-2">
                                      <button
                                        onClick={() => openEditModal(task)}
                                        className="text-white/40 hover:text-white/70 transition-colors"
                                      >
                                        <Edit size={16} />
                                      </button>
                                      <button
                                        onClick={() => setDeleteConfirmation(task.id)}
                                        className="text-white/40 hover:text-red-400 transition-colors"
                                      >
                                        <Trash2 size={16} />
                                      </button>
                                    </div>
                                  </div>

                                  {task.description && (
                                    <p className="text-white/50 text-sm mb-3 line-clamp-2">{task.description}</p>
                                  )}

                                  <div className="flex flex-wrap items-center gap-2 mt-2">
                                    <span
                                      className={cn(
                                        "inline-flex items-center px-2 py-1 rounded-full text-xs",
                                        `${getPriorityColor(task.priority)}`,
                                        " text-white"
                                      )}
                                    >
                                      {getPriorityLabel(task.priority)}
                                    </span>

                                    {task.due_date && (
                                      <span className="inline-flex items-center text-white/50 text-xs">
                                        <Calendar size={12} className="mr-1" />
                                        {format(new Date(task.due_date), "MMM d, yyyy")}
                                      </span>
                                    )}

                                    <span className="inline-flex items-center text-white/40 text-xs ml-auto">
                                      <Clock size={12} className="mr-1" />#{task.sequence_number}
                                    </span>
                                  </div>

                                  {/* Delete confirmation */}
                                  <AnimatePresence>
                                    {deleteConfirmation === task.id && (
                                      <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="mt-3 pt-3 border-t border-white/10"
                                      >
                                        <div className="flex items-center justify-between">
                                          <p className="text-red-400 text-sm flex items-center">
                                            <AlertCircle size={14} className="mr-1" />
                                            Delete this task?
                                          </p>
                                          <div className="flex space-x-2">
                                            <button
                                              onClick={() => handleDeleteTask(task.id)}
                                              className="bg-red-500/20 hover:bg-red-500/30 text-red-400 text-xs px-2 py-1 rounded"
                                            >
                                              Delete
                                            </button>
                                            <button
                                              onClick={() => setDeleteConfirmation(null)}
                                              className="bg-white/5 hover:bg-white/10 text-white/70 text-xs px-2 py-1 rounded"
                                            >
                                              Cancel
                                            </button>
                                          </div>
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              )}
                            </Draggable>
                          ))}
                        </div>
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>

        {/* Add task button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={openCreateModal}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white flex items-center justify-center shadow-lg hover:shadow-teal-500/20 transition-shadow"
        >
          <Plus size={24} />
        </motion.button>

        {/* Task modal */}
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          task={editingTask}
          onSave={async (taskData) => {
            try {
              if (editingTask) {
                // Update existing task
                const updatedTask = {
                  ...taskData,
                  id: editingTask.id,
                };
                
                // Update UI optimistically
                setTasks(tasks.map(t => t.id === editingTask.id ? { ...updatedTask, sequence_number: t.sequence_number, created_at: t.created_at, updated_at: new Date().toISOString() } : t));
                
                // Send update to API
                await updateTask(editingTask.id, updatedTask);
              } else {
                // Create new task
                const createdTask = await createTask(taskData);
                
                // Add new task to the list
                setTasks([...tasks, createdTask]);
              }
              
              setIsModalOpen(false);
            } catch (err) {
              console.error("Failed to save task:", err);
              setError("Failed to save task. Please try again.");
              
              // Refresh tasks from server on error
              const refreshedTasks = await fetchTasks();
              setTasks(refreshedTasks);
            }
          }}
        />
      </div>
    </div>
  );
}