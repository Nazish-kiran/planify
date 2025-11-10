"use client";
import { useState } from "react";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [error, setError] = useState("");

  // Common API base URL
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const res = await fetch(`${API_BASE}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (res.ok) {
        window.location.href = "/planner";
      } else {
        const data = await res.json();
        setError(data.message || "Invalid email or password");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const fullname = e.target.fullname.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const res = await fetch(`${API_BASE}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullname, email, password }),
      });

      if (res.ok) {
        setActiveTab("login");
        setError("");
      } else {
        const data = await res.json();
        setError(data.message || "Signup failed");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-900 text-white">
      <div className="w-full max-w-md">
        <div className="bg-zinc-800 p-8 rounded-lg shadow-lg">
          {/* Toggle Tabs */}
          <div className="mb-4 flex justify-around">
            <button
              onClick={() => setActiveTab("login")}
              className={`py-2 px-4 border-b-2 ${
                activeTab === "login"
                  ? "border-blue-500"
                  : "border-transparent"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab("signup")}
              className={`py-2 px-4 border-b-2 ${
                activeTab === "signup"
                  ? "border-green-500"
                  : "border-transparent"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500 text-white p-2 rounded mb-4 text-center">
              {error}
            </div>
          )}

          {/* Login Form */}
          {activeTab === "login" && (
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="mt-1 block w-full p-2 bg-zinc-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  className="mt-1 block w-full p-2 bg-zinc-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors"
              >
                Login
              </button>
            </form>
          )}

          {/* Signup Form */}
          {activeTab === "signup" && (
            <form onSubmit={handleSignup}>
              <div className="mb-4">
                <label className="block text-sm font-medium">Full Name</label>
                <input
                  type="text"
                  name="fullname"
                  placeholder="Enter your full name"
                  className="mt-1 block w-full p-2 bg-zinc-700 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="mt-1 block w-full p-2 bg-zinc-700 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Choose a password"
                  className="mt-1 block w-full p-2 bg-zinc-700 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-green-600 rounded hover:bg-green-700 transition-colors"
              >
                Sign Up
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
