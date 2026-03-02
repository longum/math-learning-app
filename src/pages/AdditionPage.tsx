import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { BlocksDisplay } from '../components/BlocksDisplay';
import { generateAdditionAnimation } from '../utils/additionGenerator';
import { validateEquation } from '../utils/validator';
import { AnimationStep, Block, DifficultyLevel } from '../types';

const AdditionPage: React.FC = () => {
  const { level } = useParams<{ level: string }>();
  const difficulty: DifficultyLevel = (level === 'level1' || level === 'level2' ? level : 'level1');
  const [num1, setNum1] = useState<string>('');
  const [num2, setNum2] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [animationSteps, setAnimationSteps] = useState<AnimationStep[]>([]);
  const [error, setError] = useState<string>('');

  const generateAnimation = () => {
    // Use validation utility
    const validation = validateEquation(num1, num2, '+');

    if (!validation.isValid) {
      setError(validation.error || 'Please enter valid numbers');
      return;
    }

    setError('');
    const parsedNum1 = parseInt(num1);
    const parsedNum2 = parseInt(num2);

    const steps = generateAdditionAnimation(parsedNum1, parsedNum2, difficulty);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-3 sm:p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Addition with Base-10 Blocks</h1>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
            Visualize addition operations using interactive base-10 blocks
          </p>

          <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="num1" className="block text-sm font-medium text-gray-700 mb-2">
                  First Number
                </label>
                <input
                  id="num1"
                  type="number"
                  min="0"
                  max="999"
                  value={num1}
                  onChange={(e) => setNum1(e.target.value)}
                  placeholder="Enter first number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="num2" className="block text-sm font-medium text-gray-700 mb-2">
                  Second Number
                </label>
                <input
                  id="num2"
                  type="number"
                  min="0"
                  max="999"
                  value={num2}
                  onChange={(e) => setNum2(e.target.value)}
                  placeholder="Enter second number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level: {difficulty === 'level1' ? '1-100' : '1-1000'}
                </label>
                <div className="text-sm text-gray-600">
                  {difficulty === 'level1' ? 'Level 1: Tens and Ones (0-99)' : 'Level 2: Hundreds, Tens, Ones (100-999)'}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={generateAnimation}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
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
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Next Step
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-3">How Addition Works</h2>
          <div className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-600">
            <p>• <strong>Step by Step:</strong> Watch the animation build up the solution</p>
            <p>• <strong>Regrouping:</strong> When you have 10 ones, they regroup into 1 ten</p>
            <p>• <strong>Visual Learning:</strong> See how blocks combine to form larger numbers</p>
            <p>• <strong>Two Levels:</strong> Start with tens and ones, then progress to hundreds</p>
            <p>• <strong>Interactive:</strong> Control the pace of learning with Previous/Next buttons</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdditionPage;