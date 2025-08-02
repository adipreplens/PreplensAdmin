import React, { useState } from 'react';
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
  const [showSolution, setShowSolution] = useState(false);
  
  // Determine if this is a new question with proper answer structure
  const hasNewAnswerStructure = question.correctOptionIndex !== undefined || question.correctOptionLetter;
  
  // For old questions, try to find the correct answer by matching answer text
  const getCorrectOptionIndex = () => {
    if (question.correctOptionIndex !== undefined) {
      return question.correctOptionIndex;
    }
    if (question.correctOptionLetter) {
      return ['A', 'B', 'C', 'D'].indexOf(question.correctOptionLetter);
    }
    // For old questions, try to match answer text with options
    if (question.answer && question.options) {
      return question.options.findIndex(opt => opt === question.answer);
    }
    return -1; // No correct answer found
  };

  const correctIndex = getCorrectOptionIndex();
  const correctLetter = question.correctOptionLetter || (correctIndex >= 0 ? ['A', 'B', 'C', 'D'][correctIndex] : null);

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-6 border border-gray-100 transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg">
      <div className="flex items-start gap-2 mb-2">
        <input type="checkbox" className="mt-1" disabled />
        <div className="flex-1">
          <span className="font-bold text-lg">Question:</span>
          <div className="ml-2 text-base" dangerouslySetInnerHTML={{ __html: question.text }} />
          {difficultyBadge(question.difficulty)}
          {bloomsBadge(question.blooms)}
          
          {/* Display real image if available */}
          {question.imageUrl && (
            <div className="mt-3">
              <img 
                src={question.imageUrl} 
                alt="Question diagram" 
                className="max-w-full h-auto rounded-lg border border-gray-200 shadow-sm"
                style={{ maxHeight: '300px' }}
                onError={(e) => {
                  // Fallback if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>
      </div>
      <div className="ml-7 mb-2">
        {question.options && question.options.map((opt, idx) => {
          const isCorrect = idx === correctIndex;
          
          return (
            <div key={idx} className={`mb-1 p-2 rounded ${isCorrect ? 'bg-green-50 border border-green-200' : ''}`}>
              <span className={`font-semibold ${isCorrect ? 'text-green-700' : 'text-gray-700'}`}>
                {optionLabels[idx]}. {opt}
                {isCorrect && <span className="ml-2 text-green-600">✓ Correct Answer</span>}
              </span>
            </div>
          );
        })}
      </div>
      
      {/* Show correct answer summary */}
      {correctIndex >= 0 && (
        <div className="ml-7 mb-2 p-3 bg-green-50 border border-green-200 rounded">
          <span className="font-semibold text-green-700">Correct Answer: </span>
          <span className="text-green-700 font-bold">
            {correctLetter ? `Option ${correctLetter} - ` : ''}{question.answer || question.options[correctIndex]}
          </span>
          {!hasNewAnswerStructure && (
            <div className="text-xs text-gray-500 mt-1">
              ⚠️ This question was created before the answer system update
            </div>
          )}
        </div>
      )}
      
      {/* Show warning if no correct answer is set */}
      {correctIndex === -1 && (
        <div className="ml-7 mb-2 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <span className="font-semibold text-yellow-700">⚠️ No Correct Answer Set</span>
          <div className="text-xs text-yellow-600 mt-1">
            This question doesn't have a correct answer configured. Please edit the question to set the correct answer.
          </div>
        </div>
      )}
      
      {/* Show marks and time */}
      <div className="ml-7 mb-2">
        <span className="font-semibold">Marks: </span>
        <span>{question.marks || '-'}</span>
        <span className="ml-4 font-semibold">Time: </span>
        <span>{question.timeLimit ? `${question.timeLimit} sec` : '-'}</span>
      </div>
      
      {/* Solution section */}
      <div className="ml-7">
        <button 
          className={`px-4 py-2 rounded font-semibold mb-2 ${
            question.solution 
              ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' 
              : 'bg-gray-50 text-gray-500 cursor-not-allowed'
          }`}
          onClick={() => question.solution && setShowSolution(!showSolution)}
          disabled={!question.solution}
        >
          {showSolution ? 'Hide Solution' : 'View Solution'}
        </button>
        
        {showSolution && question.solution && (
          <div className="mt-2 p-4 bg-blue-50 border border-blue-200 rounded">
            <h4 className="font-semibold text-blue-800 mb-2">Solution:</h4>
            <div 
              className="text-blue-700"
              dangerouslySetInnerHTML={{ __html: question.solution }}
            />
          </div>
        )}
        
        {!question.solution && (
          <div className="text-xs text-gray-500 mt-1">
            No solution available for this question
          </div>
        )}
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