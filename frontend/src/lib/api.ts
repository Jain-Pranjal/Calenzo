// // here we will make all the api requests to the backend and export them



import axios from "axios";
import { Task, TaskStatus, TaskPriority } from "@/types/task";
import {UserProfile} from "@/types/users";

const api = axios.create({
  baseURL: "http://localhost:8000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});




// **** USER PROFILE API ****

export const fetchUser = async (): Promise<UserProfile> => {
  try {
    const response = await api.get("profiles/");
    if (!response.data.length) {
      throw new Error("User data not found");
    }
    return response.data[0]; //  Return the first user object as sirf vhi return hoga jo logged in hai
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || "Failed to fetch user");
  }
};

  export const updateUser = async (id: number, userData: Partial<UserProfile>): Promise<UserProfile> => {
    try {
      const response = await api.patch(`profiles/${id}/`, userData);
      return response.data;
    } catch (error:any) {
      throw new Error(error.response?.data?.detail || "Failed to update user");
    }
  };


  export const deleteUser = async (id: number): Promise<void> => {
    try {
        await api.delete(`profiles/${id}/`);
    } catch (error:any) {
        throw new Error(error.response?.data?.detail || "Failed to delete user");
    }
  };
  



// **** TASKS API ****
export const fetchTasks = async (): Promise<Task[]> => {
  try {
    const response = await api.get("tasks/");
    return response.data;
  } catch (error:any) {
    throw new Error(error.response?.data?.detail || "Failed to fetch tasks");
  }
};

export const createTask = async (
  taskData: Omit<Task, "id" | "sequence_number" | "created_at" | "updated_at">
): Promise<Task> => {
  try {
    const response = await api.post("tasks/", taskData);
    return response.data;
  } catch (error:any) {
    throw new Error(error.response?.data?.detail || "Failed to create task");
  }
};

export const updateTask = async (
  id: number,
  taskData: Partial<Omit<Task, "id" | "sequence_number" | "created_at" | "updated_at">>
): Promise<Task> => {
  try {
    const response = await api.patch(`tasks/${id}/`, taskData);
    return response.data;
  } catch (error:any) {
    throw new Error(error.response?.data?.detail || "Failed to update task");
  }
};

export const deleteTask = async (id: number): Promise<void> => {
  try {
    await api.delete(`tasks/${id}/`);
  } catch (error:any) {
    throw new Error(error.response?.data?.detail || "Failed to delete task");
  }
};