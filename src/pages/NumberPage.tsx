import React, { useState } from 'react';
import { BlocksDisplay } from '../components/BlocksDisplay';
import { parseNumberToBlocks, DifficultyLevel } from '../utils/numberParser';
import { validateNumber } from '../utils/validator';
import { Block } from '../types';

const NumberPage: React.FC = () => {
  const [number, setNumber] = useState<string>('');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('level1');
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [error, setError] = useState<string>('');

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNumber(value);

    // Clear error
    if (error) setError('');

    // Parse number if valid
    if (value === '') {
      setBlocks([]);
      return;
    }

    // Use validation utility
    const validation = validateNumber(value);
    if (!validation.isValid) {
      setError(validation.error || 'Please enter a valid number');
      setBlocks([]);
      return;
    }

    const num = parseInt(value);
    setBlocks(parseNumberToBlocks(num, difficulty));
  };

  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDifficulty = e.target.value as DifficultyLevel;
    setDifficulty(newDifficulty);

    if (number) {
      const num = parseInt(number);
      if (!isNaN(num) && num >= 0 && num <= 999) {
        setBlocks(parseNumberToBlocks(num, newDifficulty));
      }
    }
  };

  const clearInput = () => {
    setNumber('');
    setBlocks([]);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-3 sm:p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Number Visualization</h1>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
            Enter a number to see it represented with base-10 blocks
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="flex-1">
              <label htmlFor="number-input" className="block text-sm font-medium text-gray-700 mb-2">
                Enter a number (0-999)
              </label>
              <div className="flex gap-2">
                <input
                  id="number-input"
                  type="number"
                  min="0"
                  max="999"
                  value={number}
                  onChange={handleNumberChange}
                  placeholder="Enter a number"
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                />
                <button
                  onClick={clearInput}
                  className="px-3 sm:px-4 py-2 sm:py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm sm:text-base"
                >
                  Clear
                </button>
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
            </div>

            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty Level
              </label>
              <select
                id="difficulty"
                value={difficulty}
                onChange={handleDifficultyChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              >
                <option value="level1">Level 1: Tens and Ones</option>
                <option value="level2">Level 2: Hundreds, Tens, Ones</option>
              </select>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-3 sm:mb-4">Base-10 Blocks</h2>
            <BlocksDisplay blocks={blocks} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-3">How It Works</h2>
          <div className="space-y-2 text-sm sm:text-base text-gray-600">
            <p>• <strong>Hundreds:</strong> Orange squares representing 100 units each</p>
            <p>• <strong>Tens:</strong> Green bars divided into 10 sections, representing 10 units each</p>
            <p>• <strong>Ones:</strong> Blue vertical bars representing single units</p>
            <p>• <strong>Level 1:</strong> Numbers 0-99 using tens and ones</p>
            <p>• <strong>Level 2:</strong> Numbers 100-999 using hundreds, tens, and ones</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NumberPage;