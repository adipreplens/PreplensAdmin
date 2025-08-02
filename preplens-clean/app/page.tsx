"use client";
import React, { useState, useRef, useEffect } from 'react';
import BulkUploadForm from '../components/BulkUploadForm';
import QuestionsList, { QuestionsListHandle } from '../components/QuestionsList';
import CreateQuestionForm from '../components/CreateQuestionForm';
import Statistics from '../components/Statistics';
import Link from 'next/link';

const sidebarItems = [
  { icon: '🏠', label: 'Dashboard' },
  { icon: '🗂️', label: 'Manage' },
  { icon: '📝', label: 'Exams' },
  { icon: '📚', label: 'Subjects' },
  {
    icon: '❓',
    label: 'Questions',
    subItems: [
      { label: 'All Questions' },
      { label: 'Manage Questions' },
    ],
  },
  { icon: '🧪', label: 'Mock Tests' },
  { icon: '📺', label: 'Live Tests' },
  { icon: '🏆', label: 'Leaderboard' },
  { icon: '🤝', label: 'Referrals' },
  { icon: '💎', label: 'Premium' },
  { icon: '👨‍🏫', label: 'Teachers' },
  { icon: '⚙️', label: 'Settings' },
];

export default function HomePage() {
  // All hooks must be called at the top level, before any conditional returns
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [loginError, setLoginError] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Dashboard state hooks - moved to top level
  const [activeSection, setActiveSection] = useState('Dashboard');
  const [activeQuestionTab, setActiveQuestionTab] = useState('Manage Questions');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createType, setCreateType] = useState<'static' | 'power' | null>(null);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const questionsListRef = useRef<QuestionsListHandle>(null);

  useEffect(() => {
    const savedToken = typeof window !== 'undefined' ? localStorage.getItem('jwtToken') : null;
    const savedEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : null;
    if (savedToken && savedEmail) {
      setToken(savedToken);
      setUserEmail(savedEmail);
      setIsLoggedIn(true);
    }
  }, []);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Login failed');
      }
      const data = await res.json();
      setToken(data.token);
      setUserEmail(loginEmail);
      setIsLoggedIn(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('jwtToken', data.token);
        localStorage.setItem('userEmail', loginEmail);
      }
    } catch (err: any) {
      setLoginError(err.message);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setUserEmail('');
    setIsLoggedIn(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('userEmail');
    }
  };

  const handleSidebarItemClick = (section: string) => {
    setActiveSection(section);
    setDrawerOpen(false);
  };

  const handleUploadSuccess = () => {
    setShowBulkUpload(false);
    if (questionsListRef.current) {
      questionsListRef.current.refresh();
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
          <h1 className="text-2xl font-bold mb-2 text-center">Preplens Admin Login</h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              value={loginEmail}
              onChange={e => setLoginEmail(e.target.value)}
              className="border p-2 rounded"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={loginPassword}
              onChange={e => setLoginPassword(e.target.value)}
              className="border p-2 rounded"
              required
            />
            <button type="submit" className="btn-primary">Login</button>
            {loginError && <div className="text-red-600 text-sm text-center">{loginError}</div>}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Hamburger for mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-primary-600 text-white p-2 rounded-full shadow-lg focus:outline-none"
        onClick={() => setDrawerOpen(true)}
        aria-label="Open sidebar"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      {/* Overlay for drawer */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity duration-300"
          onClick={() => setDrawerOpen(false)}
        />
      )}
      {/* Sidebar/Drawer */}
      <aside
        className={`w-64 bg-gradient-to-b from-primary-700 to-primary-600 text-white flex flex-col rounded-none shadow-xl min-h-screen
          fixed z-50 top-0 left-0 h-full transition-transform duration-300
          ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}
          md:static md:translate-x-0 md:block`}
        style={{ maxWidth: '100vw' }}
      >
        <div className="h-20 flex items-center justify-center border-b border-primary-800">
          <span className="text-3xl font-extrabold tracking-wide">📝 Preplens</span>
        </div>
        <nav className="flex-1 py-6 space-y-2">
          {sidebarItems.map((item) =>
            item.subItems ? (
              <div key={item.label}>
                <SidebarItem
                  icon={item.icon}
                  label={item.label}
                  active={activeSection.startsWith(item.label)}
                  onClick={() => handleSidebarItemClick(item.label + ' > ' + activeQuestionTab)}
                />
                {activeSection.startsWith(item.label) && (
                  <div className="ml-10 mt-1 space-y-1">
                    {item.subItems.map((sub) => (
                      <SidebarItem
                        key={sub.label}
                        icon={''}
                        label={sub.label}
                        active={activeSection === item.label + ' > ' + sub.label}
                        onClick={() => handleSidebarItemClick(item.label + ' > ' + sub.label)}
                        small
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <SidebarItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                active={activeSection === item.label}
                onClick={() => handleSidebarItemClick(item.label)}
              />
            )
          )}
        </nav>
      </aside>
      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Top Bar */}
        <header className="h-16 bg-primary-600 flex items-center justify-between px-6 text-white shadow">
          <div className="flex items-center space-x-3">
            <span className="text-lg font-semibold">Preplens Admin Dashboard</span>
            <span className="text-xs bg-white/20 px-2 py-1 rounded">Empowering Government Exam Prep</span>
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative focus:outline-none">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            </button>
            <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
              <span className="inline-block w-7 h-7 rounded-full bg-primary-700 flex items-center justify-center font-bold text-lg uppercase">{userEmail?.[0] || 'A'}</span>
              {userEmail}
            </span>
            <button
              onClick={handleLogout}
              className="ml-2 bg-white/20 hover:bg-white/30 text-white px-4 py-1 rounded-full text-sm font-semibold transition-colors duration-150"
            >
              Logout
            </button>
          </div>
        </header>
        {/* Dynamic Content */}
        <main className="flex-1 p-8 bg-gray-50 overflow-y-auto">
          <div>
            {activeSection === 'Dashboard' ? (
              <div>
                <div className="text-2xl font-bold text-primary-600 mb-6">Dashboard</div>
                <div className="mb-6 p-4 bg-white rounded-lg shadow border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Quick Overview</h3>
                      <p className="text-gray-600 text-sm">Real-time question statistics</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary-600" id="totalQuestions">Loading...</div>
                      <div className="text-sm text-gray-500">Total Questions</div>
                    </div>
                  </div>
                </div>
                <Statistics />
              </div>
            ) : activeSection === 'Questions > All Questions' ? (
              <div>
                <div className="text-2xl font-bold text-primary-600 mb-6">All Questions</div>
                <QuestionsList ref={questionsListRef} />
              </div>
            ) : activeSection === 'Questions > Manage Questions' ? (
              <div>
                {/* 4. Main Content: Use navigation links for Create and Bulk Upload */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                  <div className="text-2xl font-bold text-primary-600">Manage Questions</div>
                  <div className="flex gap-2 mt-4 md:mt-0">
                    <Link href="/bulk-upload">
                      <button className="btn-secondary">Bulk Upload</button>
                    </Link>
                    <Link href="/create-question">
                      <button className="btn-primary">Create New</button>
                    </Link>
                  </div>
                </div>
                {/* Remove modal logic for showBulkUpload and showCreateModal */}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-96">
                <div className="text-3xl font-bold text-primary-600 mb-2">{activeSection.replace('Questions > ', '')}</div>
                <div className="text-gray-500 text-lg">This is the {activeSection.replace('Questions > ', '')} section.</div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, active = false, onClick, small = false }: { icon: string; label: string; active?: boolean; onClick?: () => void; small?: boolean }) {
  return (
    <div
      className={`flex items-center px-6 py-2 cursor-pointer transition-colors duration-150 ${
        active ? 'bg-white/20 font-semibold' : 'hover:bg-white/10'
      } ${small ? 'text-sm pl-8 py-1' : ''}`}
      onClick={onClick}
    >
      {icon && <span className="mr-3 text-xl">{icon}</span>}
      <span className="text-base">{label}</span>
    </div>
  );
} 