export type TaskStatus = 'todo' | 'inprogress' | 'done';

export type TaskPriority = 0 | 1 | 2;

export interface Task {
    id: number;
    sequence_number: number;
    title: string;
    description?: string;
    due_date: string | null;
    status: TaskStatus;
    priority: TaskPriority;
    user: number; // User ID as it is given in the API as a number
    created_at: string;
    updated_at: string;
  }
  

export interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onSave: (task: Omit<Task, "id" | "sequence_number" | "created_at" | "updated_at">) => void;
}