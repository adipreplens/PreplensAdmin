import React, { useState, useEffect } from 'react';

interface Statistics {
  totalQuestions: number;
  questionsBySubject: Array<{ _id: string; count: number }>;
  questionsByExam: Array<{ _id: string; count: number }>;
  questionsByDifficulty: Array<{ _id: string; count: number }>;
  questionsWithSolutions: number;
  questionsWithImages: number;
  questionsWithoutSolutions: number;
  questionsWithoutImages: number;
}

const Statistics: React.FC = () => {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const response = await fetch(`${apiUrl}/statistics`);
      if (!response.ok) {
        throw new Error('Failed to fetch statistics');
      }
      const data = await response.json();
      setStats(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-800 font-semibold">Error loading statistics</div>
        <div className="text-red-600 text-sm">{error}</div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Main Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Questions</p>
              <p className="text-3xl font-bold">{stats.totalQuestions}</p>
            </div>
            <div className="text-blue-200">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">With Solutions</p>
              <p className="text-3xl font-bold">{stats.questionsWithSolutions}</p>
              <p className="text-green-200 text-sm">
                {stats.totalQuestions > 0 ? Math.round((stats.questionsWithSolutions / stats.totalQuestions) * 100) : 0}%
              </p>
            </div>
            <div className="text-green-200">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">With Images</p>
              <p className="text-3xl font-bold">{stats.questionsWithImages}</p>
              <p className="text-purple-200 text-sm">
                {stats.totalQuestions > 0 ? Math.round((stats.questionsWithImages / stats.totalQuestions) * 100) : 0}%
              </p>
            </div>
            <div className="text-purple-200">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Needs Solutions</p>
              <p className="text-3xl font-bold">{stats.questionsWithoutSolutions}</p>
              <p className="text-orange-200 text-sm">Requires attention</p>
            </div>
            <div className="text-orange-200">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Questions by Subject */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Questions by Subject</h3>
          <div className="space-y-3">
            {stats.questionsBySubject.map((item, index) => (
              <div key={item._id} className="flex items-center justify-between">
                <span className="text-gray-600">{item._id || 'Unknown'}</span>
                <span className="font-semibold text-gray-800">{item.count}</span>
              </div>
            ))}
            {stats.questionsBySubject.length === 0 && (
              <p className="text-gray-500 text-sm">No subject data available</p>
            )}
          </div>
        </div>

        {/* Questions by Exam */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Questions by Exam</h3>
          <div className="space-y-3">
            {stats.questionsByExam.map((item, index) => (
              <div key={item._id} className="flex items-center justify-between">
                <span className="text-gray-600">{item._id || 'Unknown'}</span>
                <span className="font-semibold text-gray-800">{item.count}</span>
              </div>
            ))}
            {stats.questionsByExam.length === 0 && (
              <p className="text-gray-500 text-sm">No exam data available</p>
            )}
          </div>
        </div>

        {/* Questions by Difficulty */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Questions by Difficulty</h3>
          <div className="space-y-3">
            {stats.questionsByDifficulty.map((item, index) => (
              <div key={item._id} className="flex items-center justify-between">
                <span className="text-gray-600">{item._id || 'Unknown'}</span>
                <span className="font-semibold text-gray-800">{item.count}</span>
              </div>
            ))}
            {stats.questionsByDifficulty.length === 0 && (
              <p className="text-gray-500 text-sm">No difficulty data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Completion Status</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Solutions Added</span>
              <span className="text-gray-800 font-medium">
                {stats.questionsWithSolutions} / {stats.totalQuestions}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${stats.totalQuestions > 0 ? (stats.questionsWithSolutions / stats.totalQuestions) * 100 : 0}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Images Added</span>
              <span className="text-gray-800 font-medium">
                {stats.questionsWithImages} / {stats.totalQuestions}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${stats.totalQuestions > 0 ? (stats.questionsWithImages / stats.totalQuestions) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-center">
        <button
          onClick={fetchStatistics}
          className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-200 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Statistics
        </button>
      </div>
    </div>
  );
};

export default Statistics; 