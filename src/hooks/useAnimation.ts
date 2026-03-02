import React, { useState, useCallback, useRef } from 'react';
import { AnimationStep } from '../types';

interface AnimationControls {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  speed: number;
}

interface UseAnimationReturn {
  controls: AnimationControls;
  firstStep: () => void;
  lastStep: () => void;
  nextStep: () => void;
  prevStep: () => void;
  togglePlay: () => void;
  setStep: (step: number) => void;
  setSpeed: (speed: number) => void;
}

export function useAnimation(steps: AnimationStep[]): UseAnimationReturn {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1000); // Default: 1 second per step
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Update current step when steps change
  React.useEffect(() => {
    if (currentStep >= steps.length) {
      setCurrentStep(steps.length - 1);
    }
  }, [steps, currentStep, steps.length]);

  // Auto-play functionality
  React.useEffect(() => {
    if (isPlaying && steps.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speed);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, speed, steps.length]);

  const controls: AnimationControls = {
    currentStep,
    totalSteps: steps.length,
    isPlaying,
    speed,
  };

  const firstStep = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(0);
  }, []);

  const lastStep = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(steps.length - 1);
  }, [steps.length]);

  const nextStep = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  }, [steps.length]);

  const prevStep = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(prev => Math.max(prev - 1, 0));
  }, []);

  const togglePlay = useCallback(() => {
    if (steps.length === 0) return;

    setIsPlaying(prev => !prev);
  }, [steps.length]);

  const setStep = useCallback((step: number) => {
    setIsPlaying(false);
    setCurrentStep(Math.max(0, Math.min(step, steps.length - 1)));
  }, [steps.length]);

  const setSpeedControl = useCallback((newSpeed: number) => {
    setSpeed(newSpeed);
  }, []);

  return {
    controls,
    firstStep,
    lastStep,
    nextStep,
    prevStep,
    togglePlay,
    setStep,
    setSpeed: setSpeedControl,
  };
}

