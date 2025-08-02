import React, { useState, useRef, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

interface CreateQuestionFormProps {
  onSuccess?: () => void;
}

const CreateQuestionForm: React.FC<CreateQuestionFormProps> = ({ onSuccess }) => {
  const [questionType, setQuestionType] = useState<'static' | 'power'>('static');
  const [questionText, setQuestionText] = useState('');
  const [solutionText, setSolutionText] = useState('');
  const [diagramFile, setDiagramFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null);
  const [marks, setMarks] = useState('');
  const [timer, setTimer] = useState('');
  const [tags, setTags] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Memoize modules to prevent re-renders
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['link', 'image'],
        ['clean']
      ],
      handlers: {
        image: () => {
          const input = document.createElement('input');
          input.setAttribute('type', 'file');
          input.setAttribute('accept', 'image/*');
          input.click();
          input.onchange = async () => {
            if (!input.files || input.files.length === 0) return;
            const file = input.files[0];
            const formData = new FormData();
            formData.append('image', file);
            const res = await fetch('http://localhost:4000/upload-image', {
              method: 'POST',
              body: formData,
            });
            const data = await res.json();
            // For now, we'll just show a success message since we don't have the quill ref
            console.log('Image uploaded:', data.url);
            alert('Image uploaded successfully! You can copy the URL and paste it in the editor.');
          };
        }
      }
    }
  }), []);

  // Memoize formats to prevent re-renders
  const formats = useMemo(() => [
    'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'link', 'image'
  ], []);

  // Stable change handlers
  const handleQuestionTextChange = useCallback((value: string) => {
    setQuestionText(value);
  }, []);

  const handleSolutionTextChange = useCallback((value: string) => {
    setSolutionText(value);
  }, []);

  // Diagram upload handler
  const handleDiagramChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setDiagramFile(file);
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch('http://localhost:4000/upload-image', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    setImageUrl(data.url);
    setUploading(false);
  };

  // Option change handler
  const handleOptionChange = (idx: number, value: string) => {
    setOptions(prev => prev.map((opt, i) => (i === idx ? value : opt)));
    // Clear error when user starts typing options
    if (errors.options) {
      setErrors(prev => ({ ...prev, options: '' }));
    }
  };

  // Validation function
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    // Check if question text is provided
    if (!questionText.trim()) {
      newErrors.questionText = 'Question text is required';
    }

    // Check if all options are filled
    const emptyOptions = options.filter(opt => !opt.trim());
    if (emptyOptions.length > 0) {
      newErrors.options = 'All options must be filled';
    }

    // Check if correct answer is selected
    if (correctAnswer === null) {
      newErrors.correctAnswer = 'Please select the correct answer';
    }

    // Check if marks are provided
    if (!marks.trim()) {
      newErrors.marks = 'Marks are required';
    } else if (parseInt(marks) <= 0) {
      newErrors.marks = 'Marks must be greater than 0';
    }

    // Check if timer is provided
    if (!timer.trim()) {
      newErrors.timer = 'Time limit is required';
    } else if (parseInt(timer) <= 0) {
      newErrors.timer = 'Time limit must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form before submitting
    if (!validateForm()) {
      return; // Stop submission if validation fails
    }
    
    setSubmitting(true);
    setSuccess(false);
    const questionData = {
      type: questionType,
      text: questionText,
      solution: solutionText,
      options,
      correctAnswer: correctAnswer, // Send the index (0-3) instead of text
      marks: marks ? parseInt(marks) : undefined,
      timeLimit: timer ? parseInt(timer) : undefined,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      imageUrl,
    };
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${apiUrl}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(questionData),
      });
      if (res.ok) {
        setSuccess(true);
        setQuestionText('');
        setSolutionText('');
        setOptions(['', '', '', '']);
        setCorrectAnswer(null);
        setMarks('');
        setTimer('');
        setTags('');
        setImageUrl(null);
        setDiagramFile(null);
        setErrors({}); // Clear errors on success
        if (onSuccess) onSuccess();
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-8 mt-6">
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded font-semibold border ${questionType === 'static' ? 'bg-primary-600 text-white' : 'bg-white text-primary-600'}`}
          onClick={() => setQuestionType('static')}
        >
          Static Question
        </button>
        <button
          className={`px-4 py-2 rounded font-semibold border ${questionType === 'power' ? 'bg-primary-600 text-white' : 'bg-white text-primary-600'}`}
          onClick={() => setQuestionType('power')}
        >
          Power Question
        </button>
      </div>
      {questionType === 'static' ? (
        <form onSubmit={handleSubmit}>
          <label className="block font-semibold mb-2">Question Text (with image support):</label>
          <ReactQuill
            value={questionText}
            onChange={handleQuestionTextChange}
            modules={modules}
            formats={formats}
            theme="snow"
            placeholder="Type your question here..."
            style={{ minHeight: 150, marginBottom: 24 }}
          />
          {errors.questionText && (
            <div className="text-red-600 text-sm mt-1">{errors.questionText}</div>
          )}
          <div className="mt-4">
            <label className="block font-semibold mb-2">Upload Diagram (optional):</label>
            <input type="file" accept="image/*" onChange={handleDiagramChange} />
            {uploading && <div className="text-blue-600 mt-2">Uploading...</div>}
            {imageUrl && (
              <div className="mt-2">
                <div className="font-semibold">Preview:</div>
                <img src={imageUrl} alt="Diagram Preview" style={{ maxWidth: 300, maxHeight: 200 }} />
              </div>
            )}
          </div>
          <div className="mt-4">
            <label className="block font-semibold mb-2">Options: <span className="text-red-500">*</span></label>
            {[0, 1, 2, 3].map(idx => (
              <div key={idx} className={`flex items-center gap-2 mb-2 p-2 rounded ${correctAnswer === idx ? 'bg-green-50 border border-green-200' : ''}`}>
                <input
                  type="radio"
                  name="correctAnswer"
                  checked={correctAnswer === idx}
                  onChange={() => {
                    setCorrectAnswer(idx);
                    if (errors.correctAnswer) {
                      setErrors(prev => ({ ...prev, correctAnswer: '' }));
                    }
                  }}
                  className="accent-primary-600"
                />
                <input
                  type="text"
                  className={`input-field flex-1 ${errors.options ? 'border-red-500' : ''}`}
                  placeholder={`Option ${idx + 1}`}
                  value={options[idx]}
                  onChange={e => handleOptionChange(idx, e.target.value)}
                  required
                />
                {correctAnswer === idx && (
                  <span className="text-green-600 font-semibold text-sm">✓ Correct Answer</span>
                )}
              </div>
            ))}
            {errors.options && (
              <div className="text-red-600 text-sm mt-1">{errors.options}</div>
            )}
            {errors.correctAnswer && (
              <div className="text-red-600 text-sm mt-1">{errors.correctAnswer}</div>
            )}
          </div>
          <div className="mt-4 flex gap-4">
            <div>
              <label className="block font-semibold mb-2">Marks:</label>
              <input
                type="number"
                className={`input-field ${errors.marks ? 'border-red-500' : ''}`}
                placeholder="Marks"
                value={marks}
                onChange={e => {
                  setMarks(e.target.value);
                  if (errors.marks) {
                    setErrors(prev => ({ ...prev, marks: '' }));
                  }
                }}
                min={0}
                required
              />
              {errors.marks && (
                <div className="text-red-600 text-sm mt-1">{errors.marks}</div>
              )}
            </div>
            <div>
              <label className="block font-semibold mb-2">Timer (seconds):</label>
              <input
                type="number"
                className={`input-field ${errors.timer ? 'border-red-500' : ''}`}
                placeholder="Time in seconds"
                value={timer}
                onChange={e => {
                  setTimer(e.target.value);
                  if (errors.timer) {
                    setErrors(prev => ({ ...prev, timer: '' }));
                  }
                }}
                min={0}
                required
              />
              {errors.timer && (
                <div className="text-red-600 text-sm mt-1">{errors.timer}</div>
              )}
            </div>
          </div>
          <div className="mt-4">
            <label className="block font-semibold mb-2">Tags (comma separated):</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. algebra,math,ssc"
              value={tags}
              onChange={e => setTags(e.target.value)}
            />
          </div>
          <div className="mt-4">
            <label className="block font-semibold mb-2">Solution (rich text):</label>
            <ReactQuill
              value={solutionText}
              onChange={handleSolutionTextChange}
              modules={modules}
              formats={formats}
              theme="snow"
              placeholder="Type your solution here..."
              style={{ minHeight: 100, marginBottom: 24 }}
            />
          </div>
          <button type="submit" className="btn-primary mt-6" disabled={submitting || uploading}>
            {uploading
              ? 'Uploading Image...'
              : submitting
                ? 'Submitting...'
                : 'Submit Question'}
          </button>
          {uploading && (
            <div className="text-red-600 mt-2">Please wait for the image to finish uploading before submitting.</div>
          )}
          {success && <div className="text-green-600 mt-4">Question submitted successfully!</div>}
          
          {/* Summary section */}
          {correctAnswer !== null && options[correctAnswer] && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
              <h3 className="font-semibold text-blue-800 mb-2">Question Summary:</h3>
              <div className="text-sm text-blue-700">
                <p><strong>Correct Answer:</strong> Option {['A', 'B', 'C', 'D'][correctAnswer]} - {options[correctAnswer]}</p>
                <p><strong>Marks:</strong> {marks || 'Not set'}</p>
                <p><strong>Time Limit:</strong> {timer || 'Not set'} seconds</p>
                <p><strong>Options:</strong> {options.filter(opt => opt.trim()).length}/4 filled</p>
              </div>
            </div>
          )}
        </form>
      ) : (
        <div className="text-gray-500 text-lg text-center py-12">Power Question creation coming soon!</div>
      )}
    </div>
  );
};

export default CreateQuestionForm; 