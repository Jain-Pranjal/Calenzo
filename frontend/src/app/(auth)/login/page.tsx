
"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    password: "",
    general: "", // Added for API errors
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
        general: "",
      }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { username: "", password: "", general: "" };

    if (!credentials.username.trim()) {
      newErrors.username = "Username is required";
      isValid = false;
    }

    if (!credentials.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (credentials.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:8000/api/token/", credentials,{headers: {
        "Content-Type": "application/json",
      }});
      localStorage.setItem("accessToken", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);
      router.push("/");
    } catch (error) {
      const errorMsg = error.response?.data?.detail || "Login failed. Please try again.";
      setErrors((prev) => ({
        ...prev,
        general: errorMsg,
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 * i,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#030303] px-4 py-12">
      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/[0.03] via-transparent to-purple-500/[0.03] blur-3xl" />

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />

      <motion.div
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-md bg-white/[0.02] backdrop-blur-sm border border-white/[0.05] rounded-2xl p-8 shadow-xl"
      >
        <motion.div custom={0} variants={fadeInUp} className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400 flex items-center justify-center mx-auto mb-4">
            <span className="text-lg font-bold text-black">C</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-white/50 text-sm">Log in to your Calenzo account</p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <motion.div custom={1} variants={fadeInUp} className="mb-5">
            <label htmlFor="username" className="block text-sm font-medium text-white/70 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              className={cn(
                "w-full px-4 py-3 bg-white/[0.03] border rounded-lg focus:outline-none focus:ring-2 transition-all text-white",
                errors.username
                  ? "border-red-500/50 focus:ring-red-500/20"
                  : "border-white/10 focus:ring-teal-500/20 focus:border-teal-500/50"
              )}
              placeholder="Enter your username"
              disabled={isLoading}
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-400">{errors.username}</p>
            )}
          </motion.div>

          <motion.div custom={2} variants={fadeInUp} className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-white/70 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                className={cn(
                  "w-full px-4 py-3 bg-white/[0.03] border rounded-lg focus:outline-none focus:ring-2 transition-all text-white",
                  errors.password
                    ? "border-red-500/50 focus:ring-red-500/20"
                    : "border-white/10 focus:ring-teal-500/20 focus:border-teal-500/50"
                )}
                placeholder="Enter your password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-400">{errors.password}</p>
            )}
            {errors.general && (
              <p className="mt-1 text-sm text-red-400">{errors.general}</p>
            )}
            <div className="flex justify-end mt-2">
              <Link href="/forgot-password" className="text-sm text-teal-400 hover:text-teal-300 transition-colors">
                Forgot password?
              </Link>
            </div>
          </motion.div>

          <motion.div custom={3} variants={fadeInUp}>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Log In <ArrowRight size={16} className="ml-2" />
                </>
              )}
            </button>
          </motion.div>
        </form>

        <motion.div custom={4} variants={fadeInUp} className="mt-8 text-center">
          <p className="text-white/50 text-sm">
            Don't have an account?{" "}
            <Link href="/signup" className="text-teal-400 hover:text-teal-300 transition-colors">
              Sign up
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}