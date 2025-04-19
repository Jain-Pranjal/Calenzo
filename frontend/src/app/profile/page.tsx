"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fetchUser, updateUser, deleteUser } from "@/lib/api";
import { UserProfile } from "@/types/users";
import { Toaster, toast } from "sonner";

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const userData = await fetchUser();
        setUser(userData);
        setFormData(userData);
      } catch (err: any) {
        setError(err.message || "Failed to load profile.");
        if (err.message?.includes("401")) {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData || !user) return;
    setIsLoading(true);
    try {
      const updatedUser = await updateUser(user.id, {
        username: formData.username,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
      });
      setUser(updatedUser);
      setError(null);
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to update profile.");
      toast.error("Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    const confirmed = window.confirm("Are you sure you want to delete your account?");
    if (!confirmed) return;

    setIsLoading(true);
    try {
      await deleteUser(user.id);
      toast.success("Account deleted successfully!");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete account.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#030303] text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#030303] text-white flex items-center justify-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] text-white p-8">
      <Toaster />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto"
      >
        <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-white/70">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData?.username || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-white"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white/70">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData?.email || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-white"
            />
          </div>
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium text-white/70">
              First Name
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData?.first_name || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-white"
            />
          </div>
          <div>
            <label htmlFor="last_name" className="block text-sm font-medium text-white/70">
              Last Name
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData?.last_name || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-white"
            />
          </div>
          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isLoading ? "Updating..." : "Update Profile"}
            </button>
            <button
              type="button"
              onClick={handleDeleteAccount}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition"
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete Account"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
