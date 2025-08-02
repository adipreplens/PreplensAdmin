"use client";
import React from "react";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-2 text-center">PrepLens Admin</h1>
        <p className="text-center text-gray-600">
          Welcome to PrepLens Admin Dashboard
        </p>
        <p className="text-center text-sm text-gray-500 mt-2">
          Logged in as: admin@preplens.com
        </p>
        <button
          onClick={() => {
            if (typeof window !== "undefined") {
              localStorage.removeItem("jwtToken");
              localStorage.removeItem("userEmail");
            }
            window.location.reload();
          }}
          className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
