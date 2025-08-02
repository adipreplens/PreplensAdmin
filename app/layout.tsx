'use client';
import React, { useState } from 'react';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // We'll use a simple state for login for now
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        {!isLoggedIn ? (
          <LoginPage onLogin={(email) => { setIsLoggedIn(true); setUserEmail(email); }} />
        ) : (
          <>
            {React.cloneElement(children as React.ReactElement, { onLogout: () => setIsLoggedIn(false), userEmail })}
          </>
        )}
      </body>
    </html>
  );
}

function LoginPage({ onLogin }: { onLogin: (email: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (email && password) {
        onLogin(email);
      } else {
        setError('Please enter both email and password.');
      }
    }, 800);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 to-blue-400">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-blue-700 rounded-full w-16 h-16 flex items-center justify-center mb-2">
            <span className="text-3xl text-white font-bold">P</span>
          </div>
          <h1 className="text-2xl font-bold text-blue-700">Preplens Admin Login</h1>
          <p className="text-gray-500 text-sm mt-1">Prepare for Government Exams</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="input-field"
              placeholder="admin@preplens.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className="input-field"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button
            type="submit"
            className="btn-primary w-full flex items-center justify-center"
            disabled={loading}
          >
            {loading ? <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span> : null}
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
} 