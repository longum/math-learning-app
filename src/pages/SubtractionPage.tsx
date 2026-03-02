import React, { useState } from 'react';
import { BlocksDisplay } from '../components/BlocksDisplay';
import { generateSubtractionAnimation } from '../utils/subtractionGenerator';
import { DifficultyLevel } from '../utils/numberParser';
import { validateEquation } from '../utils/validator';
import { AnimationStep, Block } from '../types';

const SubtractionPage: React.FC = () => {
  const [num1, setNum1] = useState<string>('');
  const [num2, setNum2] = useState<string>('');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('level1');
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [animationSteps, setAnimationSteps] = useState<AnimationStep[]>([]);
  const [error, setError] = useState<string>('');

  const generateAnimation = () => {
    // Use validation utility
    const validation = validateEquation(num1, num2, '-');

    if (!validation.isValid) {
      setError(validation.error || 'Please enter valid numbers');
      return;
    }

    setError('');
    const parsedNum1 = parseInt(num1);
    const parsedNum2 = parseInt(num2);

    const steps = generateSubtractionAnimation(parsedNum1, parsedNum2, difficulty);
    setAnimationSteps(steps);
    setCurrentStep(0);
  };

  const nextStep = () => {
    if (currentStep < animationSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetAnimation = () => {
    setNum1('');
    setNum2('');
    setAnimationSteps([]);
    setCurrentStep(0);
    setError('');
  };

  const getCurrentBlocks = () => {
    if (animationSteps.length === 0 || currentStep >= animationSteps.length) {
      return [];
    }

    const step = animationSteps[currentStep];
    // Flatten the blocks array if it's nested
    if (step.blocks && Array.isArray(step.blocks[0])) {
      return step.blocks.flat() as Block[];
    }
    return step.blocks || [];
  };

  const canProceed = animationSteps.length > 0 && currentStep < animationSteps.length - 1;
  const canGoBack = currentStep > 0;
  const hasError = animationSteps.length === 1 && animationSteps[0].action === 'error';

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 p-3 sm:p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Subtraction with Base-10 Blocks</h1>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
            Visualize subtraction operations using interactive base-10 blocks
          </p>

          <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="num1" className="block text-sm font-medium text-gray-700 mb-2">
                  First Number (larger number)
                </label>
                <input
                  id="num1"
                  type="number"
                  min="0"
                  max="999"
                  value={num1}
                  onChange={(e) => setNum1(e.target.value)}
                  placeholder="Enter larger number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="num2" className="block text-sm font-medium text-gray-700 mb-2">
                  Second Number (smaller number)
                </label>
                <input
                  id="num2"
                  type="number"
                  min="0"
                  max="999"
                  value={num2}
                  onChange={(e) => setNum2(e.target.value)}
                  placeholder="Enter smaller number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level
                </label>
                <select
                  id="difficulty"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="level1">Level 1: Tens and Ones</option>
                  <option value="level2">Level 2: Hundreds, Tens, Ones</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={generateAnimation}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Generate Animation
                </button>
                <button
                  onClick={resetAnimation}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Reset
                </button>
              </div>

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">Animation Steps</h2>
              {animationSteps.length > 0 ? (
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">
                    Step {currentStep + 1} of {animationSteps.length}
                  </div>
                  <div className="font-medium text-gray-800">
                    {animationSteps[currentStep]?.description}
                  </div>
                  <div className="text-sm text-gray-500">
                    {animationSteps[currentStep]?.action && `Action: ${animationSteps[currentStep].action}`}
                  </div>
                  {hasError && (
                    <div className="mt-2 p-3 bg-red-100 border border-red-300 rounded-lg">
                      <p className="text-sm text-red-700">
                        Make sure the first number is larger than the second number.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-sm text-gray-500">
                  Enter numbers and click "Generate Animation" to start
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-3 sm:mb-4">Base-10 Blocks</h2>
            <BlocksDisplay blocks={getCurrentBlocks()} />
          </div>

          {animationSteps.length > 0 && (
            <div className="flex justify-between items-center">
              <button
                onClick={prevStep}
                disabled={!canGoBack}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  canGoBack
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Previous Step
              </button>

              <span className="text-sm text-gray-600">
                Progress: {Math.round((currentStep / (animationSteps.length - 1)) * 100)}%
              </span>

              <button
                onClick={nextStep}
                disabled={!canProceed}
                className={`px-3 sm:px-4 py-2 rounded-lg transition-colors ${
                  canProceed
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Next Step
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-3">How Subtraction Works</h2>
          <div className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-600">
            <p>• <strong>Step by Step:</strong> Watch the animation show how blocks are removed</p>
            <p>• <strong>Borrowing:</strong> When you don't have enough ones, borrow from tens</p>
            <p>• <strong>Regrouping:</strong> Exchange larger blocks for smaller ones when needed</p>
            <p>• <strong>Visual Learning:</strong> See how blocks are removed to find the difference</p>
            <p>• <strong>Two Levels:</strong> Start with tens and ones, then progress to hundreds</p>
            <p>• <strong>Interactive:</strong> Control the pace of learning with Previous/Next buttons</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubtractionPage;