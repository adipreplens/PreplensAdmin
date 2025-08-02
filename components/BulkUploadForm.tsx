import React, { useState } from 'react';
import QuestionCard from './QuestionCard';

const EXAMS = [
  'RRB JE',
  'RRB ALP',
  'RRB Technician',
  'RRB NTPC',
  'SSC CGL',
  'SSC CHSL',
  'SSC JE',
];
const SUBJECTS = [
  'Quantitative Aptitude',
  'Reasoning',
  'English',
  'General Knowledge',
  'Computer Knowledge',
  'Current Affairs',
];
const DIFFICULTY = ['Basic', 'Intermediate', 'Advanced', 'Expert'];
const CATEGORIES = ['Conceptual', 'Application', 'Learning', 'Analytical'];
const LANGUAGES = ['English', 'Hindi'];
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

interface BulkUploadFormProps {
  onClose: () => void;
  onUploadSuccess?: () => void; // Add this prop
}

export default function BulkUploadForm({ onClose, onUploadSuccess }: BulkUploadFormProps) {
  const [form, setForm] = useState({
    exam: '',
    subject: '',
    language: '',
    difficulty: '',
    category: '',
    timeLimit: '',
    marks: '',
    file: null as File | null,
    tags: '',
    blooms: '',
  });
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [uploadSummary, setUploadSummary] = useState<string | null>(null);
  const [uploadedQuestions, setUploadedQuestions] = useState<any[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as any;
    setForm(f => ({
      ...f,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setMessage(null);
    setUploadSummary(null);
    setUploadedQuestions([]);
    const fd = new FormData();
    fd.append('file', form.file!);
    fd.append('exam', form.exam);
    fd.append('subject', form.subject);
    fd.append('language', form.language);
    fd.append('difficulty', form.difficulty);
    fd.append('category', form.category);
    fd.append('timeLimit', form.timeLimit);
    fd.append('marks', form.marks);
    fd.append('tags', form.tags);
    fd.append('blooms', form.blooms);
    try {
      const res = await fetch('http://localhost:4000/bulk-upload', {
        method: 'POST',
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setMessage('Bulk upload successful!');
      setUploadSummary(`${data.added || 0} questions added successfully.`);
      setUploadedQuestions(data.questions || []);
      setUploading(false);
      // Do not close immediately; let user see preview
      setTimeout(() => {
        setMessage(null);
        setUploadSummary(null);
        setForm({
          exam: '', subject: '', language: '', difficulty: '', category: '', timeLimit: '', file: null, tags: '', blooms: '', marks: ''
        });
        onClose();
        if (onUploadSuccess) onUploadSuccess();
      }, 5000); // Show preview for 5 seconds
    } catch (err: any) {
      setMessage(`Upload failed. ${err.message || ''}`);
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-8 mt-6">
      <div className="flex justify-between items-center mb-4">
        <div className="text-2xl font-bold">Bulk Upload</div>
        <button className="text-primary-600 underline text-sm" onClick={onClose}>Close</button>
      </div>
      <div className="text-gray-500 mb-6">Upload multiple questions at once for government job exams</div>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Exam<span className="text-red-500">*</span></label>
            <select className="input-field" name="exam" value={form.exam} onChange={handleChange} required>
              <option value="">Select Exam</option>
              {EXAMS.map(e => <option key={e}>{e}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Subject<span className="text-red-500">*</span></label>
            <select className="input-field" name="subject" value={form.subject} onChange={handleChange} required>
              <option value="">Select Subject</option>
              {SUBJECTS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Language<span className="text-red-500">*</span></label>
            <select className="input-field" name="language" value={form.language} onChange={handleChange} required>
              <option value="">Select Language</option>
              {LANGUAGES.map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Difficulty Level<span className="text-red-500">*</span></label>
            <select className="input-field" name="difficulty" value={form.difficulty} onChange={handleChange} required>
              <option value="">Select Difficulty</option>
              {DIFFICULTY.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Blooms</label>
            <select className="input-field" name="blooms" value={form.blooms} onChange={handleChange} required>
              <option value="">Select Blooms</option>
              {BLOOMS.map(b => <option key={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Marks<span className="text-red-500">*</span></label>
            <input
              className="input-field"
              name="marks"
              type="number"
              min="1"
              value={form.marks}
              onChange={handleChange}
              required
              placeholder="Enter marks for each question"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Time (seconds)<span className="text-red-500">*</span></label>
            <input
              className="input-field"
              name="timeLimit"
              type="number"
              min="1"
              value={form.timeLimit}
              onChange={handleChange}
              required
              placeholder="Enter time for each question"
            />
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Attachment</label>
          <div className="flex items-center gap-2">
            <input type="file" name="file" className="input-field" accept=".docx,.csv,.xlsx" onChange={handleChange} required />
            <span className="text-xs text-gray-500">Max 50 questions can be uploaded.</span>
          </div>
        </div>
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <a href="#" className="text-primary-600 underline text-sm">Tag Details</a>
          </div>
          <a
            href="http://localhost:4000/template"
            download
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary-600 text-white px-4 py-2 rounded font-semibold hover:bg-primary-700 transition"
          >
            Download Template
          </a>
        </div>
        <div className="mb-6">
          <div className="font-semibold mb-2">Mandatory Tags<span className="text-red-500">*</span>:</div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <select className="input-field"><option>Select Category</option>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select>
            <input className="input-field" placeholder="Time Limit (sec)" name="timeLimit" value={form.timeLimit} onChange={handleChange} />
          </div>
        </div>
        <div className="mb-6">
          <div className="font-semibold mb-2">Add More Tags</div>
          <div className="flex gap-2">
            <input className="input-field flex-1" placeholder="Add Tag" name="tags" value={form.tags} onChange={handleChange} />
            <button type="button" className="border px-3 py-1 rounded text-gray-700 flex items-center gap-2">🔍</button>
          </div>
        </div>
        {message && <div className={`mb-4 text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{message}</div>}
        {uploadSummary && <div className="mb-4 text-green-700 font-semibold">{uploadSummary}</div>}
        {uploadedQuestions.length > 0 && (
          <div className="mt-4">
            <div className="font-semibold mb-2 text-primary-700">Preview of Uploaded Questions:</div>
            {uploadedQuestions.map((q, idx) => (
              <QuestionCard key={q.id || idx} question={q} />
            ))}
            <div className="text-xs text-gray-500">This preview will close automatically.</div>
          </div>
        )}
        <div className="flex justify-end">
          <button className="btn-primary px-8 flex items-center justify-center" disabled={uploading}>
            {uploading ? (<span className="flex items-center"><svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>Uploading...</span>) : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
} 