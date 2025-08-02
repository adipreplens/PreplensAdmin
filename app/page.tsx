"use client";
import React, { useState, useEffect } from "react";
import BulkUploadForm from "../components/BulkUploadForm";
import QuestionsList from "../components/QuestionsList";
import Statistics from "../components/Statistics";

export default function Page() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [currentView, setCurrentView] = useState("dashboard");
  const [showBulkUpload, setShowBulkUpload] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    const email = localStorage.getItem("userEmail");
    if (token && email) {
      setIsLoggedIn(true);
      setUserEmail(email);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://preplensadmin.onrender.com'}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("jwtToken", data.token);
        localStorage.setItem("userEmail", email);
        setIsLoggedIn(true);
        setUserEmail(email);
      } else {
        alert("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    setUserEmail("");
    setCurrentView("dashboard");
  };

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
          <h1 className="text-2xl font-bold mb-6 text-center">PrepLens Admin</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="admin@preplens.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="admin123"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">PrepLens Admin</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Logged in as: {userEmail}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 py-4">
            <button
              onClick={() => setCurrentView("dashboard")}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                currentView === "dashboard"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setCurrentView("create-question")}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                currentView === "create-question"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Create Question
            </button>
            <button
              onClick={() => setCurrentView("bulk-upload")}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                currentView === "bulk-upload"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Bulk Upload
            </button>
            <button
              onClick={() => setCurrentView("questions")}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                currentView === "questions"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Questions
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === "dashboard" && <Statistics />}
        {currentView === "create-question" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Create Question</h2>
            <p className="text-gray-600">Create Question form will be implemented here.</p>
          </div>
        )}
        {currentView === "bulk-upload" && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Bulk Upload Questions</h2>
              <button
                onClick={() => setShowBulkUpload(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                Upload CSV
              </button>
            </div>
            {showBulkUpload && (
              <BulkUploadForm
                onClose={() => setShowBulkUpload(false)}
                onUploadSuccess={() => {
                  setShowBulkUpload(false);
                  setCurrentView("questions");
                }}
              />
            )}
          </div>
        )}
        {currentView === "questions" && <QuestionsList />}
      </main>
    </div>
  );
}
