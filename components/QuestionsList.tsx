import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import QuestionCard from './QuestionCard';

export interface Question {
  id: number;
  text: string;
  options?: string[];
  answer: string;
  subject?: string;
  exam?: string;
  difficulty?: string;
  tags?: string[];
  blooms?: string; // Added blooms field
}

export interface QuestionsListHandle {
  refresh: () => void;
}

const PAGE_SIZE = 10;

const BLOOMS = [
  'Aptitude Skills',
  'AO1',
  'AO2',
  'Logical Thinking',
  'Evaluating',
  'Synthesis',
  'Understanding',
  'Remembering',
  'Applying',
  'Analysing',
  'AO3',
  'Creating',
  'Comprehension Skills',
];

const QuestionsList = forwardRef<QuestionsListHandle, {}>((props, ref) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [examFilter, setExamFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [page, setPage] = useState(1);
  const [highlightedIds, setHighlightedIds] = useState<number[]>([]);
  const [view, setView] = useState<'card' | 'table'>('card');
  const [bloomsFilter, setBloomsFilter] = useState('');

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/questions');
      const data = await res.json();
      setQuestions(data);
      // Highlight new uploads (last 10 seconds)
      const now = Date.now();
      setHighlightedIds(
        data.filter((q: any) => q.id && now - q.id < 10000).map((q: any) => q.id)
      );
    } catch (err) {
      setQuestions([]);
    }
    setLoading(false);
  };

  useImperativeHandle(ref, () => ({
    refresh: fetchQuestions,
  }));

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Filtering
  const filtered = questions.filter(q => {
    const matchesSearch =
      q.text.toLowerCase().includes(search.toLowerCase()) ||
      (q.answer && q.answer.toLowerCase().includes(search.toLowerCase()));
    const matchesSubject = subjectFilter ? q.subject === subjectFilter : true;
    const matchesExam = examFilter ? q.exam === examFilter : true;
    const matchesDifficulty = difficultyFilter ? (q.difficulty && q.difficulty.toLowerCase() === difficultyFilter.toLowerCase()) : true;
    const matchesBlooms = bloomsFilter ? (q.blooms && q.blooms === bloomsFilter) : true;
    return matchesSearch && matchesSubject && matchesExam && matchesDifficulty && matchesBlooms;
  });

  // Pagination
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Unique subjects/exams for filters
  const subjects = Array.from(new Set(questions.map(q => q.subject).filter(Boolean)));
  const exams = Array.from(new Set(questions.map(q => q.exam).filter(Boolean)));
  const blooms = Array.from(new Set(questions.map(q => q.blooms).filter(Boolean)));

  useEffect(() => { setPage(1); }, [search, subjectFilter, examFilter, difficultyFilter, bloomsFilter]);

  return (
    <div className="mt-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <input
          className="input-field w-full md:w-1/3"
          placeholder="Search questions or answers..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className="input-field" value={subjectFilter} onChange={e => setSubjectFilter(e.target.value)}>
          <option value="">All Subjects</option>
          {subjects.map(s => <option key={s}>{s}</option>)}
        </select>
        <select className="input-field" value={examFilter} onChange={e => setExamFilter(e.target.value)}>
          <option value="">All Exams</option>
          {exams.map(e => <option key={e}>{e}</option>)}
        </select>
        {/* Difficulty filter with only Easy, Medium, Hard */}
        <select className="input-field" value={difficultyFilter} onChange={e => setDifficultyFilter(e.target.value)}>
          <option value="">All Difficulty</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        {/* Blooms filter with custom options */}
        <select className="input-field" value={bloomsFilter} onChange={e => setBloomsFilter(e.target.value)}>
          <option value="">All Blooms</option>
          {BLOOMS.map(b => <option key={b}>{b}</option>)}
        </select>
        <div className="flex gap-2">
          <button className={`px-3 py-1 rounded border ${view === 'card' ? 'bg-primary-600 text-white' : ''}`} onClick={() => setView('card')}>Card View</button>
          <button className={`px-3 py-1 rounded border ${view === 'table' ? 'bg-primary-600 text-white' : ''}`} onClick={() => setView('table')}>Table View</button>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <svg className="animate-spin h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
        </div>
      ) : !filtered.length ? (
        <div className="text-center text-gray-500 py-8">No questions found.</div>
      ) : view === 'card' ? (
        <div>
          {paginated.map(q => (
            <QuestionCard key={q.id} question={q} />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded shadow bg-white">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Question</th>
                <th className="px-4 py-2">Options</th>
                <th className="px-4 py-2">Answer</th>
                <th className="px-4 py-2">Exam</th>
                <th className="px-4 py-2">Subject</th>
                <th className="px-4 py-2">Difficulty</th>
                <th className="px-4 py-2">Tags</th>
                <th className="px-4 py-2">Blooms</th>
                <th className="px-4 py-2">Marks</th>
                <th className="px-4 py-2">Time (sec)</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(q => (
                <tr key={q.id} className={`border-t ${highlightedIds.includes(q.id) ? 'bg-green-50 animate-pulse' : ''}`}>
                  <td className="px-4 py-2">{q.id}</td>
                  <td className="px-4 py-2 max-w-xs break-words">{q.text}</td>
                  <td className="px-4 py-2">{q.options ? q.options.filter(Boolean).join(', ') : '-'}</td>
                  <td className="px-4 py-2">{q.answer}</td>
                  <td className="px-4 py-2">{q.exam || '-'}</td>
                  <td className="px-4 py-2">{q.subject || '-'}</td>
                  <td className="px-4 py-2">{q.difficulty || '-'}</td>
                  <td className="px-4 py-2">{q.tags ? q.tags.join(', ') : '-'}</td>
                  <td className="px-4 py-2">{q.blooms || '-'}</td>
                  <td className="px-4 py-2">{q.marks || '-'}</td>
                  <td className="px-4 py-2">{q.timeLimit || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8 py-4 bg-gray-50 rounded-xl shadow-inner">
          <button
            className="px-3 py-1 rounded-full border border-primary-200 bg-white hover:bg-primary-100 transition disabled:opacity-50"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              className={`w-8 h-8 rounded-full border flex items-center justify-center font-semibold transition
                ${page === idx + 1 ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-primary-600 border-primary-200 hover:bg-primary-100'}`}
              onClick={() => setPage(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}
          <button
            className="px-3 py-1 rounded-full border border-primary-200 bg-white hover:bg-primary-100 transition disabled:opacity-50"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
});

export default QuestionsList; 