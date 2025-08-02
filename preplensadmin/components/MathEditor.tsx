import React, { useState } from 'react';

interface MathEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (latex: string, target?: 'question' | 'solution' | 'option', optionIndex?: number) => void;
  target?: 'question' | 'solution' | 'option';
  optionIndex?: number;
}

const MathEditor: React.FC<MathEditorProps> = ({ isOpen, onClose, onInsert, target: propTarget, optionIndex: propOptionIndex }) => {
  const [target, setTarget] = useState<'question' | 'solution' | 'option'>(propTarget || 'question');
  const [optionIndex, setOptionIndex] = useState<number>(propOptionIndex || 0);
  const [latex, setLatex] = useState('');

  // Update internal state when props change
  React.useEffect(() => {
    if (propTarget) setTarget(propTarget);
    if (propOptionIndex !== undefined) setOptionIndex(propOptionIndex);
  }, [propTarget, propOptionIndex]);

  const basicSymbols = [
    '.', '.', '*', '+', '-', '÷', '×', '=', '≠',
    ':', '∴', ',', "'", '!', ';', '?', 'x̄', 'x⃗'
  ];

  const mathSymbols = [
    '∫', '∑', '∏', '√', '∞', '±', '≤', '≥', '≈',
    'α', 'β', 'γ', 'δ', 'ε', 'θ', 'λ', 'μ', 'π'
  ];

  const matrixSymbols = [
    '(', ')', '[', ']', '{', '}', '|', '||', '⌊', '⌋',
    '⌈', '⌉', '⟨', '⟩', '⟦', '⟧', '⟪', '⟫'
  ];

  const formulaSymbols = [
    'sin', 'cos', 'tan', 'log', 'ln', 'exp', 'lim', '→', '←', '↔',
    '∈', '∉', '⊂', '⊃', '∪', '∩', '∅', '∀', '∃'
  ];

  const arrowSymbols = [
    '→', '←', '↔', '⇒', '⇐', '⇔', '↑', '↓', '↗', '↘',
    '↙', '↖', '⟶', '⟵', '⟷', '⟹', '⟸', '⟺'
  ];

  const alphabetSymbols = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
    'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
    'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd',
    'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
    'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x',
    'y', 'z'
  ];

  const [activeTab, setActiveTab] = useState('Basic');

  const getSymbols = () => {
    switch (activeTab) {
      case 'Basic': return basicSymbols;
      case 'Maths': return mathSymbols;
      case 'Matrix': return matrixSymbols;
      case 'Formula': return formulaSymbols;
      case 'Arrow': return arrowSymbols;
      case 'Alphabet': return alphabetSymbols;
      default: return basicSymbols;
    }
  };

  const handleSymbolClick = (symbol: string) => {
    setLatex(prev => prev + symbol);
  };

  const handleInsert = () => {
    if (latex.trim()) {
      onInsert(latex, target, optionIndex);
      setLatex('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-11/12 max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-orange-500">f(x)</div>
            <div>
              <h2 className="text-lg font-semibold">Math Editor</h2>
              <h3 className="text-2xl font-bold text-orange-500">f(x) Math Editor</h3>
              <p className="text-sm text-gray-600">
                Adding to: {target === 'question' ? 'Question Text' : target === 'solution' ? 'Solution' : `Option ${optionIndex + 1}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Input Area */}
        <div className="p-4">
          <textarea
            value={latex}
            onChange={(e) => setLatex(e.target.value)}
            placeholder="Enter LaTeX mathematical expression..."
            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Tabs */}
        <div className="px-4">
          <div className="flex space-x-1 border-b">
            {['Basic', 'Maths', 'Matrix', 'Formula', 'Arrow', 'Alphabet'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === tab
                    ? 'bg-orange-500 text-white border-b-2 border-orange-500'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Symbols Grid */}
        <div className="p-4 max-h-64 overflow-y-auto">
          <div className="grid grid-cols-9 gap-2">
            {getSymbols().map((symbol, index) => (
              <button
                key={index}
                onClick={() => handleSymbolClick(symbol)}
                className="p-2 text-lg border border-gray-200 rounded hover:bg-orange-50 hover:border-orange-300 transition-colors"
                title={symbol}
              >
                {symbol}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleInsert}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Add LaTeX
          </button>
        </div>
      </div>
    </div>
  );
};

export default MathEditor; 