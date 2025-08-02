import React from 'react';
import { Question } from './QuestionsList';

interface QuestionCardProps {
  question: Question;
}

const optionLabels = ['A', 'B', 'C', 'D', 'E', 'F'];

const difficultyBadge = (difficulty?: string) => {
  if (!difficulty) return null;
  let color = 'bg-gray-200 text-gray-700';
  if (difficulty.toLowerCase() === 'easy') color = 'bg-green-100 text-green-700';
  else if (difficulty.toLowerCase() === 'medium') color = 'bg-yellow-100 text-yellow-800';
  else if (difficulty.toLowerCase() === 'hard') color = 'bg-red-100 text-red-700';
  return <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${color}`}>{difficulty}</span>;
};
const bloomsBadge = (blooms?: string) => {
  if (!blooms) return null;
  return <span className="ml-2 px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-700">{blooms}</span>;
};

const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  return (
    <div className="bg-white rounded-xl shadow p-6 mb-6 border border-gray-100 transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg">
      <div className="flex items-start gap-2 mb-2">
        <input type="checkbox" className="mt-1" disabled />
        <div>
          <span className="font-bold text-lg">Question:</span>
          <span className="ml-2 text-base">{question.text}</span>
          {difficultyBadge(question.difficulty)}
          {bloomsBadge(question.blooms)}
        </div>
      </div>
      <div className="ml-7 mb-2">
        {question.options && question.options.map((opt, idx) => (
          <div key={idx} className="mb-1">
            <span className={`font-semibold ${question.answer && opt === question.answer ? 'text-green-600' : ''}`}>
              {optionLabels[idx]}. {opt}
            </span>
          </div>
        ))}
      </div>
      {/* Show correct answer below options */}
      {question.answer && (
        <div className="ml-7 mb-2">
          <span className="font-semibold text-green-700">Correct Answer: </span>
          <span className="text-green-700">{question.answer}</span>
        </div>
      )}
      {/* Show marks and time */}
      <div className="ml-7 mb-2">
        <span className="font-semibold">Marks: </span>
        <span>{question.marks || '-'}</span>
        <span className="ml-4 font-semibold">Time: </span>
        <span>{question.timeLimit ? `${question.timeLimit} sec` : '-'}</span>
      </div>
      <div className="ml-7">
        <button className="bg-blue-50 text-blue-700 px-4 py-2 rounded font-semibold mb-2">View Solution</button>
      </div>
      <div className="ml-7 text-gray-600 text-sm">
        {question.timeLimit && <span>Time to Solve: {question.timeLimit} | </span>}
        <span>Type: Single Choice Question</span>
        {question.marks && <span> | Marks: {question.marks}</span>}
        {question.language && <span> | Language: {question.language}</span>}
        {question.blooms && <span> | Blooms: {question.blooms}</span>}
        {question.difficulty && <span> | Difficulty Level: {question.difficulty}</span>}
      </div>
    </div>
  );
};

export default QuestionCard; 