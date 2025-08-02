import React from 'react';
import { Question } from './QuestionsList';

interface QuestionCardProps {
  question: Question;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  return (
    <div className="bg-white rounded-xl shadow p-6 mb-6 border border-gray-100">
      <div className="flex items-start gap-2 mb-2">
        <input type="checkbox" className="mt-1" disabled />
        <div>
          <span className="font-bold text-lg">Question:</span>
          <span className="ml-2 text-base">{question.text}</span>
        </div>
      </div>
      <div className="ml-7 mb-2">
        {question.options && question.options.map((opt, idx) => (
          <div key={idx} className="mb-1">
            <span className="font-semibold">
              {String.fromCharCode(65 + idx)}. {opt}
            </span>
          </div>
        ))}
      </div>
      {question.answer && (
        <div className="ml-7 mb-2">
          <span className="font-semibold text-green-700">Correct Answer: </span>
          <span className="text-green-700">{question.answer}</span>
        </div>
      )}
      <div className="ml-7 mb-2">
        <span className="font-semibold">Marks: </span>
        <span>-</span>
        <span className="ml-4 font-semibold">Time: </span>
        <span>-</span>
      </div>
    </div>
  );
};

export default QuestionCard; 