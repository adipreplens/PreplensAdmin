"use client";
import React, { useState, useRef, useEffect } from 'react';
import BulkUploadForm from '../components/BulkUploadForm';
import QuestionsList, { QuestionsListHandle } from '../components/QuestionsList';

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

export default function HomePage({ onLogout, userEmail }: { onLogout: () => void; userEmail: string }) {
  const [activeSection, setActiveSection] = useState('Dashboard');
  const [activeQuestionTab, setActiveQuestionTab] = useState('Manage Questions');
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const questionsListRef = useRef<QuestionsListHandle>(null);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

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
        <div className="h-16 flex items-center justify-center border-b border-primary-800">
          <span className="text-2xl font-bold tracking-wide">Preplens</span>
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
            <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">{userEmail}</span>
            <button
              onClick={onLogout}
              className="ml-2 bg-white/20 hover:bg-white/30 text-white px-4 py-1 rounded-full text-sm font-semibold transition-colors duration-150"
            >
              Logout
            </button>
          </div>
        </header>
        {/* Dynamic Content */}
        <main className="flex-1 p-8 bg-gray-50 overflow-y-auto">
          <div>
            {activeSection === 'Questions > All Questions' ? (
              <div>
                <div className="text-2xl font-bold text-primary-600 mb-6">All Questions</div>
                <QuestionsList ref={questionsListRef} />
              </div>
            ) : activeSection === 'Questions > Manage Questions' ? (
              <div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                  <div className="text-2xl font-bold text-primary-600">Manage Questions</div>
                  <div className="flex gap-2 mt-4 md:mt-0">
                    <button
                      className="border border-primary-600 text-primary-600 px-4 py-2 rounded font-semibold hover:bg-primary-50 transition"
                      onClick={() => setShowBulkUpload(true)}
                    >
                      Bulk Upload
                    </button>
                    <button className="bg-primary-600 text-white px-4 py-2 rounded font-semibold hover:bg-primary-700 transition">
                      Create New
                    </button>
                  </div>
                </div>
                {showBulkUpload && <BulkUploadForm onClose={() => setShowBulkUpload(false)} onUploadSuccess={handleUploadSuccess} />}
                <QuestionsList ref={questionsListRef} />
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