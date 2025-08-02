'use client';
import React, { useState, useEffect } from 'react';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // We'll use a simple state for login for now
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [token, setToken] = useState<string | null>(null);

  // On mount, check for token in localStorage
  useEffect(() => {
    const savedToken = typeof window !== 'undefined' ? localStorage.getItem('jwtToken') : null;
    const savedEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : null;
    if (savedToken && savedEmail) {
      setToken(savedToken);
      setUserEmail(savedEmail);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async (email: string, password: string) => {
    try {
      const res = await fetch('http://localhost:4000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Login failed');
      }
      const data = await res.json();
      setToken(data.token);
      setUserEmail(email);
      setIsLoggedIn(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('jwtToken', data.token);
        localStorage.setItem('userEmail', email);
      }
    } catch (err: any) {
      throw err;
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail('');
    setToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('userEmail');
    }
  };

  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        {!isLoggedIn ? (
          <LoginPage onLogin={handleLogin} />
        ) : (
          <>
            {React.cloneElement(children as React.ReactElement, { onLogout: handleLogout, userEmail, token })}
          </>
        )}
      </body>
    </html>
  );
}

function LoginPage({ onLogin }: { onLogin: (email: string, password: string) => Promise<void> }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onLogin(email, password);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
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