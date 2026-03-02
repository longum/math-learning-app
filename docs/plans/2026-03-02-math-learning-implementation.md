# Math Learning Application Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a React-based web application that helps children aged 5-8 understand numbers and arithmetic using Concrete-Pictorial-Abstract (CPA) method with Base-10 Blocks visualization.

**Architecture:** Single Page Application (SPA) using React 18 + Vite with React Router for navigation, Context API for global state, Framer Motion for animations, and localStorage for authentication persistence.

**Tech Stack:** React 18, Vite, React Router v6, Tailwind CSS, Framer Motion, TypeScript, Vitest

---

## Task 1: Initialize Project with Vite + React

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `src/main.tsx`, `src/App.tsx`
- Create: `src/vite-env.d.ts`

**Step 1: Create Vite React TypeScript project**

Run: `npm create vite@latest . -- --template react-ts`

Expected: Project initialized with React + TypeScript + Vite template

**Step 2: Install dependencies**

Run: `npm install`

Run: `npm install react-router-dom framer-motion`

Run: `npm install -D tailwindcss postcss autoprefixer @types/node`

Expected: All dependencies installed successfully

**Step 3: Initialize Tailwind CSS**

Run: `npx tailwindcss init -p`

Expected: Creates `tailwind.config.js` and `postcss.config.js`

**Step 4: Configure Tailwind**

Modify: `tailwind.config.js`
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          green: '#4CAF50',
          blue: '#2196F3',
        },
        light: {
          green: '#81C784',
          blue: '#64B5F6',
        },
        error: '#E57373',
        success: '#66BB6A',
      },
      fontFamily: {
        'comic': ['"Comic Sans MS"', '"Chalkboard SE"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

**Step 5: Add Tailwind directives to CSS**

Modify: `src/index.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: 'Comic Sans MS', 'Chalkboard SE', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #F5F5F5;
}
```

**Step 6: Update main.tsx**

Modify: `src/main.tsx`
```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
```

**Step 7: Create basic App component**

Modify: `src/App.tsx`
```tsx
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/" element={<div>Math Learning App</div>} />
      </Routes>
    </div>
  )
}

export default App
```

**Step 8: Commit**

Run: `git add .`

Run: `git commit -m "feat: initialize Vite React project with Tailwind CSS"`

---

## Task 2: Create Project Structure and Type Definitions

**Files:**
- Create: `src/types/index.ts`
- Create: `src/config/auth.ts`
- Create directories: `src/pages`, `src/components`, `src/hooks`, `src/utils`, `src/contexts`

**Step 1: Create type definitions**

Create: `src/types/index.ts`
```typescript
export type DifficultyLevel = 'level1' | 'level2';

export type BlockType = 'hundred' | 'ten' | 'one';

export interface Block {
  type: BlockType;
  value: number;
  count: number;
}

export interface AnimationStep {
  id: number;
  description: string;
  blocks?: Block[][];
  action?: string;
  highlight?: string[];
  showResult?: boolean;
}

export interface Equation {
  num1: number;
  num2: number;
  operator: '+' | '-';
}

export interface AuthState {
  isAuthenticated: boolean;
  user: string | null;
  expireAt: number | null;
}

export interface User {
  username: string;
  password: string;
}
```

**Step 2: Create auth configuration**

Create: `src/config/auth.ts`
```typescript
import { User } from '../types';

export const USERS: User[] = [
  { username: 'student1', password: 'math123' },
  { username: 'student2', password: 'learn456' },
];

export const AUTH_STORAGE_KEY = 'math-app-auth';
export const PREFS_STORAGE_KEY = 'math-app-preferences';
export const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes
```

**Step 3: Create directory structure**

Run: `mkdir -p src/pages src/components src/hooks src/utils src/contexts`

Expected: All directories created

**Step 4: Commit**

Run: `git add .`

Run: `git commit -m "feat: create project structure and type definitions"`

---

## Task 3: Create AuthContext

**Files:**
- Create: `src/contexts/AuthContext.tsx`

**Step 1: Write test utilities file**

Create: `src/utils/auth.ts`
```typescript
import { AUTH_STORAGE_KEY, SESSION_DURATION, USERS } from '../config/auth';
import { AuthState } from '../types';

export function validateCredentials(username: string, password: string): boolean {
  return USERS.some(
    user => user.username === username && user.password === password
  );
}

export function saveAuthState(username: string): void {
  const authState: AuthState = {
    isAuthenticated: true,
    user: username,
    expireAt: Date.now() + SESSION_DURATION,
  };
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
}

export function getAuthState(): AuthState | null {
  const stored = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!stored) return null;

  const authState: AuthState = JSON.parse(stored);

  // Check if session expired
  if (authState.expireAt && Date.now() > authState.expireAt) {
    clearAuthState();
    return null;
  }

  return authState;
}

export function clearAuthState(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}
```

**Step 2: Create AuthContext**

Create: `src/contexts/AuthContext.tsx`
```tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { validateCredentials, saveAuthState, getAuthState, clearAuthState } from '../utils/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  user: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const authState = getAuthState();
    if (authState?.isAuthenticated) {
      setIsAuthenticated(true);
      setUser(authState.user);
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    if (validateCredentials(username, password)) {
      saveAuthState(username);
      setIsAuthenticated(true);
      setUser(username);
      return true;
    }
    return false;
  };

  const logout = () => {
    clearAuthState();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

**Step 3: Update App.tsx to use AuthProvider**

Modify: `src/App.tsx`
```tsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<div>Math Learning App</div>} />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
```

**Step 4: Commit**

Run: `git add .`

Run: `git commit -m "feat: add AuthContext with login/logout functionality"`

---

## Task 4: Create LoginPage Component

**Files:**
- Create: `src/pages/LoginPage.tsx`
- Modify: `src/App.tsx`

**Step 1: Create LoginPage component**

Create: `src/pages/LoginPage.tsx`
```tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!username.trim() || !password.trim()) {
      setError('请输入用户名和密码');
      setIsLoading(false);
      return;
    }

    const success = await login(username, password);
    if (success) {
      navigate('/home');
    } else {
      setError('用户名或密码错误');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-100">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-comic text-center text-primary-green mb-8">
          数学学习乐园
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              用户名
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-blue focus:outline-none transition-colors text-lg"
              placeholder="输入用户名"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-blue focus:outline-none transition-colors text-lg"
              placeholder="输入密码"
            />
          </div>

          {error && (
            <p className="text-error text-center text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-green text-white py-3 rounded-lg font-comic text-xl hover:bg-green-600 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '登录中...' : '登录'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>测试账号：student1 / math123</p>
          <p>测试账号：student2 / learn456</p>
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Add login route to App.tsx**

Modify: `src/App.tsx`
```tsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import LoginPage from './pages/LoginPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
```

**Step 3: Test login manually**

Run: `npm run dev`

Expected: Visit http://localhost:5173, see login page, try logging in with student1/math123

**Step 4: Commit**

Run: `git add .`

Run: `git commit -m "feat: add LoginPage with form validation and error handling"`

---

## Task 5: Create HomePage Component

**Files:**
- Create: `src/pages/HomePage.tsx`
- Modify: `src/App.tsx`

**Step 1: Create HomePage component**

Create: `src/pages/HomePage.tsx`
```tsx
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { DifficultyLevel } from '../types';

export default function HomePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleDifficultySelect = (difficulty: DifficultyLevel) => {
    navigate(`/number/${difficulty}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-comic text-primary-green">
            欢迎，{user}！
          </h1>
          <button
            onClick={logout}
            className="px-6 py-2 bg-white text-error border-2 border-error rounded-lg hover:bg-red-50 transition-colors"
          >
            退出登录
          </button>
        </div>

        {/* Difficulty Selection */}
        <div className="mb-12">
          <h2 className="text-2xl font-comic text-gray-700 mb-6 text-center">
            选择难度
          </h2>
          <div className="flex justify-center gap-6">
            <button
              onClick={() => handleDifficultySelect('level1')}
              className="px-8 py-4 bg-white border-4 border-primary-green text-primary-green rounded-2xl text-xl font-comic hover:bg-green-50 active:scale-95 transition-all shadow-lg"
            >
              1-100
            </button>
            <button
              onClick={() => handleDifficultySelect('level2')}
              className="px-8 py-4 bg-white border-4 border-primary-blue text-primary-blue rounded-2xl text-xl font-comic hover:bg-blue-50 active:scale-95 transition-all shadow-lg"
            >
              1-1000
            </button>
          </div>
        </div>

        {/* Feature Selection */}
        <div>
          <h2 className="text-2xl font-comic text-gray-700 mb-6 text-center">
            选择功能
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              emoji="🔢"
              title="数字"
              subtitle="可视化"
              difficulty="level1"
              onSelect={() => navigate('/number/level1')}
            />
            <FeatureCard
              emoji="➕"
              title="加法"
              subtitle="可视化"
              difficulty="level1"
              onSelect={() => navigate('/addition/level1')}
            />
            <FeatureCard
              emoji="➖"
              title="减法"
              subtitle="可视化"
              difficulty="level1"
              onSelect={() => navigate('/subtraction/level1')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  emoji,
  title,
  subtitle,
  difficulty,
  onSelect,
}: {
  emoji: string;
  title: string;
  subtitle: string;
  difficulty: DifficultyLevel;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow active:scale-95 transition-all"
    >
      <div className="text-6xl mb-4">{emoji}</div>
      <h3 className="text-2xl font-comic text-gray-800 mb-2">{title}</h3>
      <p className="text-lg text-gray-600">{subtitle}</p>
    </button>
  );
}
```

**Step 2: Add home route to App.tsx**

Modify: `src/App.tsx`
```tsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
```

**Step 3: Test home page**

Run: `npm run dev`

Expected: After login, see home page with difficulty and feature selection

**Step 4: Commit**

Run: `git add .`

Run: `git commit -m "feat: add HomePage with difficulty and feature selection"`

---

## Task 6: Create Number Parser Utility

**Files:**
- Create: `src/utils/numberParser.ts`
- Create: `src/utils/__tests__/numberParser.test.ts`

**Step 1: Write test for number parser**

Create: `src/utils/__tests__/numberParser.test.ts`
```typescript
import { describe, it, expect } from 'vitest';
import { parseNumberToBlocks } from '../numberParser';

describe('parseNumberToBlocks', () => {
  it('should parse level1 number with only ones', () => {
    const result = parseNumberToBlocks(7, 'level1');
    expect(result).toEqual([
      { type: 'one', value: 1, count: 7 }
    ]);
  });

  it('should parse level1 number with only tens', () => {
    const result = parseNumberToBlocks(30, 'level1');
    expect(result).toEqual([
      { type: 'ten', value: 10, count: 3 }
    ]);
  });

  it('should parse level1 number with tens and ones', () => {
    const result = parseNumberToBlocks(37, 'level1');
    expect(result).toEqual([
      { type: 'ten', value: 10, count: 3 },
      { type: 'one', value: 1, count: 7 }
    ]);
  });

  it('should parse level2 number with hundreds', () => {
    const result = parseNumberToBlocks(345, 'level2');
    expect(result).toEqual([
      { type: 'hundred', value: 100, count: 3 },
      { type: 'ten', value: 10, count: 4 },
      { type: 'one', value: 1, count: 5 }
    ]);
  });

  it('should parse level2 number with only hundreds', () => {
    const result = parseNumberToBlocks(300, 'level2');
    expect(result).toEqual([
      { type: 'hundred', value: 100, count: 3 }
    ]);
  });

  it('should parse level2 number with hundreds and tens only', () => {
    const result = parseNumberToBlocks(340, 'level2');
    expect(result).toEqual([
      { type: 'hundred', value: 100, count: 3 },
      { type: 'ten', value: 10, count: 4 }
    ]);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- numberParser`

Expected: Tests fail with "Cannot find module '../numberParser'"

**Step 3: Implement number parser**

Create: `src/utils/numberParser.ts`
```typescript
import { Block, DifficultyLevel } from '../types';

export function parseNumberToBlocks(num: number, difficulty: DifficultyLevel): Block[] {
  const blocks: Block[] = [];

  if (difficulty === 'level1') {
    const tens = Math.floor(num / 10);
    const ones = num % 10;

    if (tens > 0) {
      blocks.push({ type: 'ten', value: 10, count: tens });
    }
    if (ones > 0) {
      blocks.push({ type: 'one', value: 1, count: ones });
    }
  } else {
    const hundreds = Math.floor(num / 100);
    const tens = Math.floor((num % 100) / 10);
    const ones = num % 10;

    if (hundreds > 0) {
      blocks.push({ type: 'hundred', value: 100, count: hundreds });
    }
    if (tens > 0) {
      blocks.push({ type: 'ten', value: 10, count: tens });
    }
    if (ones > 0) {
      blocks.push({ type: 'one', value: 1, count: ones });
    }
  }

  return blocks;
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- numberParser`

Expected: All tests pass

**Step 5: Commit**

Run: `git add .`

Run: `git commit -m "feat: add number parser utility with tests"`

---

## Task 7: Create Block Components

**Files:**
- Create: `src/components/OneBlock.tsx`
- Create: `src/components/TenBlock.tsx`
- Create: `src/components/HundredBlock.tsx`

**Step 1: Create OneBlock component**

Create: `src/components/OneBlock.tsx`
```tsx
interface OneBlockProps {
  count?: number;
  showLabel?: boolean;
}

export default function OneBlock({ count = 1, showLabel = false }: OneBlockProps) {
  const blocks = Array.from({ length: count });

  return (
    <div className="flex gap-0.5 flex-wrap">
      {blocks.map((_, i) => (
        <div
          key={i}
          className="w-2.5 h-10 bg-primary-blue border-2 border-blue-700 rounded-sm"
          title="个位"
        />
      ))}
      {showLabel && <span className="ml-2 text-sm text-gray-600">个位</span>}
    </div>
  );
}
```

**Step 2: Create TenBlock component**

Create: `src/components/TenBlock.tsx`
```tsx
interface TenBlockProps {
  count?: number;
  showLabel?: boolean;
}

export default function TenBlock({ count = 1, showLabel = false }: TenBlockProps) {
  const blocks = Array.from({ length: count });

  return (
    <div className="flex gap-2 flex-wrap">
      {blocks.map((_, i) => (
        <div
          key={i}
          className="relative w-24 h-10 bg-primary-green border-2 border-green-700 rounded flex"
        >
          {/* Divide into 10 ones */}
          {Array.from({ length: 10 }).map((_, j) => (
            <div
              key={j}
              className="flex-1 border-r border-green-800 last:border-r-0"
            />
          ))}
        </div>
      ))}
      {showLabel && <span className="ml-2 text-sm text-gray-600">十位</span>}
    </div>
  );
}
```

**Step 3: Create HundredBlock component**

Create: `src/components/HundredBlock.tsx`
```tsx
interface HundredBlockProps {
  count?: number;
  showLabel?: boolean;
}

export default function HundredBlock({ count = 1, showLabel = false }: HundredBlockProps) {
  const blocks = Array.from({ length: count });

  return (
    <div className="flex gap-2 flex-wrap">
      {blocks.map((_, i) => (
        <div
          key={i}
          className="relative w-24 h-24 bg-orange-500 border-2 border-orange-700 rounded flex flex-col"
        >
          {/* Create 10x10 grid */}
          {Array.from({ length: 10 }).map((_, row) => (
            <div key={row} className="flex-1 flex">
              {Array.from({ length: 10 }).map((_, col) => (
                <div
                  key={col}
                  className="flex-1 border-r border-b border-orange-800 last:border-r-0 last:border-b-0"
                />
              ))}
            </div>
          ))}
        </div>
      ))}
      {showLabel && <span className="ml-2 text-sm text-gray-600">百位</span>}
    </div>
  );
}
```

**Step 4: Commit**

Run: `git add .`

Run: `git commit -m "feat: add Base-10 Block components (OneBlock, TenBlock, HundredBlock)"`

---

## Task 8: Create BlocksDisplay Component

**Files:**
- Create: `src/components/BlocksDisplay.tsx`

**Step 1: Create BlocksDisplay component**

Create: `src/components/BlocksDisplay.tsx`
```tsx
import { Block } from '../types';
import OneBlock from './OneBlock';
import TenBlock from './TenBlock';
import HundredBlock from './HundredBlock';

interface BlocksDisplayProps {
  blocks: Block[];
  showLabels?: boolean;
  animated?: boolean;
}

export default function BlocksDisplay({ blocks, showLabels = false, animated = false }: BlocksDisplayProps) {
  return (
    <div className="flex flex-wrap gap-4 items-center">
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'hundred':
            return (
              <HundredBlock
                key={`hundred-${index}`}
                count={block.count}
                showLabel={showLabels}
              />
            );
          case 'ten':
            return (
              <TenBlock
                key={`ten-${index}`}
                count={block.count}
                showLabel={showLabels}
              />
            );
          case 'one':
            return (
              <OneBlock
                key={`ones-${index}`}
                count={block.count}
                showLabel={showLabels}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
```

**Step 2: Commit**

Run: `git add .`

Run: `git commit -m "feat: add BlocksDisplay component"`

---

## Task 9: Create NumberPage Component

**Files:**
- Create: `src/pages/NumberPage.tsx`
- Modify: `src/App.tsx`

**Step 1: Create NumberPage component**

Create: `src/pages/NumberPage.tsx`
```tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { parseNumberToBlocks } from '../utils/numberParser';
import { Block, DifficultyLevel } from '../types';
import BlocksDisplay from '../components/BlocksDisplay';

export default function NumberPage() {
  const { level } = useParams<{ level: string }>();
  const navigate = useNavigate();
  const [inputNumber, setInputNumber] = useState('');
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [error, setError] = useState('');
  const [animationStep, setAnimationStep] = useState(0);

  const difficulty = (level === 'level1' || level === 'level2' ? level : 'level1') as DifficultyLevel;
  const maxNumber = difficulty === 'level1' ? 100 : 1000;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const num = parseInt(inputNumber);

    if (!inputNumber.trim() || isNaN(num)) {
      setError('请输入数字');
      return;
    }

    if (num < 1 || num > maxNumber) {
      setError(`请输入1-${maxNumber}之间的数字`);
      return;
    }

    const result = parseNumberToBlocks(num, difficulty);
    setBlocks(result);
    setAnimationStep(1);
  };

  const handleReset = () => {
    setInputNumber('');
    setBlocks([]);
    setAnimationStep(0);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/home')}
            className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50"
          >
            ← 返回
          </button>
          <h1 className="text-3xl font-comic text-primary-green">
            数字可视化 ({difficulty === 'level1' ? '1-100' : '1-1000'})
          </h1>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                输入数字 (1-{maxNumber})
              </label>
              <input
                type="number"
                value={inputNumber}
                onChange={(e) => setInputNumber(e.target.value)}
                min="1"
                max={maxNumber}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-blue focus:outline-none text-2xl"
                placeholder="输入数字"
              />
              {error && <p className="text-error mt-2 text-sm">{error}</p>}
            </div>
            <button
              type="submit"
              className="px-8 py-3 bg-primary-green text-white rounded-lg font-comic text-xl hover:bg-green-600 active:scale-95 transition-all"
            >
              显示
            </button>
            {blocks.length > 0 && (
              <button
                type="button"
                onClick={handleReset}
                className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg font-comic text-xl hover:bg-gray-300 active:scale-95 transition-all"
              >
                重置
              </button>
            )}
          </div>
        </form>

        {/* Display Area */}
        {blocks.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-comic text-gray-800 mb-6 text-center">
              {inputNumber} = {blocks.map(b => `${b.count}${b.type === 'hundred' ? '个百' : b.type === 'ten' ? '个十' : '个一'}`).join(' + ')}
            </h2>
            <div className="flex justify-center">
              <BlocksDisplay blocks={blocks} showLabels={true} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

**Step 2: Add number route to App.tsx**

Modify: `src/App.tsx`
```tsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import NumberPage from './pages/NumberPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/number/:level"
            element={
              <ProtectedRoute>
                <NumberPage />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
```

**Step 3: Test NumberPage**

Run: `npm run dev`

Expected: Can navigate to NumberPage, input number 37, see blocks visualization

**Step 4: Commit**

Run: `git add .`

Run: `git commit -m "feat: add NumberPage with block visualization"`

---

## Task 10: Create Addition Animation Generator

**Files:**
- Create: `src/utils/additionGenerator.ts`
- Create: `src/utils/__tests__/additionGenerator.test.ts`

**Step 1: Write test for addition generator**

Create: `src/utils/__tests__/additionGenerator.test.ts`
```typescript
import { describe, it, expect } from 'vitest';
import { generateAdditionSteps } from '../additionGenerator';

describe('generateAdditionSteps', () => {
  it('should generate steps for simple addition without carry', () => {
    const steps = generateAdditionSteps(23, 45, 'level1');
    expect(steps.length).toBeGreaterThan(0);
    expect(steps[steps.length - 1].description).toContain('68');
  });

  it('should generate steps for addition with carry', () => {
    const steps = generateAdditionSteps(37, 15, 'level1');
    expect(steps.length).toBeGreaterThan(0);
    expect(steps[steps.length - 1].description).toContain('52');
  });

  it('should handle edge case 99 + 1', () => {
    const steps = generateAdditionSteps(99, 1, 'level1');
    expect(steps.length).toBeGreaterThan(0);
    expect(steps[steps.length - 1].description).toContain('100');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- additionGenerator`

Expected: Tests fail

**Step 3: Implement addition generator**

Create: `src/utils/additionGenerator.ts`
```typescript
import { AnimationStep, DifficultyLevel } from '../types';
import { parseNumberToBlocks } from './numberParser';

export function generateAdditionSteps(
  num1: number,
  num2: number,
  difficulty: DifficultyLevel
): AnimationStep[] {
  const steps: AnimationStep[] = [];
  let stepId = 1;

  // Step 1: Show both numbers
  const blocks1 = parseNumberToBlocks(num1, difficulty);
  const blocks2 = parseNumberToBlocks(num2, difficulty);

  steps.push({
    id: stepId++,
    description: `展示 ${num1} 和 ${num2}`,
    blocks: [blocks1, blocks2],
  });

  // Step 2: Merge ones
  const ones1 = num1 % 10;
  const ones2 = num2 % 10;
  const totalOnes = ones1 + ones2;

  steps.push({
    id: stepId++,
    description: `合并个位：${ones1} + ${ones2} = ${totalOnes}`,
    action: 'merge_ones',
    highlight: ['ones'],
  });

  // Step 3: Handle carry if needed
  if (totalOnes >= 10) {
    const tensToAdd = Math.floor(totalOnes / 10);
    const remainingOnes = totalOnes % 10;

    steps.push({
      id: stepId++,
      description: `${totalOnes}个一 = ${tensToAdd}个十 + ${remainingOnes}个一`,
      action: 'carry_over',
      highlight: ['carry'],
    });
  }

  // Step 4: Merge tens
  const tens1 = Math.floor(num1 / 10) % 10;
  const tens2 = Math.floor(num2 / 10) % 10;
  const carryTens = totalOnes >= 10 ? Math.floor(totalOnes / 10) : 0;
  const totalTens = tens1 + tens2 + carryTens;

  steps.push({
    id: stepId++,
    description: `合并十位：${tens1} + ${tens2}${carryTens > 0 ? ` + ${carryTens} (进位)` : ''} = ${totalTens}`,
    action: 'merge_tens',
    highlight: ['tens'],
  });

  // Step 5: Handle hundreds for level2
  if (difficulty === 'level2') {
    const hundreds1 = Math.floor(num1 / 100);
    const hundreds2 = Math.floor(num2 / 100);
    const carryHundreds = totalTens >= 10 ? Math.floor(totalTens / 10) : 0;
    const totalHundreds = hundreds1 + hundreds2 + carryHundreds;

    if (totalHundreds > 0 || carryHundreds > 0) {
      steps.push({
        id: stepId++,
        description: `合并百位：${hundreds1} + ${hundreds2}${carryHundreds > 0 ? ` + ${carryHundreds} (进位)` : ''} = ${totalHundreds}`,
        action: 'merge_hundreds',
        highlight: ['hundreds'],
      });
    }
  }

  // Final step: Show result
  const result = num1 + num2;
  const resultBlocks = parseNumberToBlocks(result, difficulty);

  steps.push({
    id: stepId++,
    description: `结果：${result}`,
    blocks: [resultBlocks],
    showResult: true,
  });

  return steps;
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- additionGenerator`

Expected: All tests pass

**Step 5: Commit**

Run: `git add .`

Run: `git commit -m "feat: add addition animation generator with tests"`

---

## Task 11: Create AdditionPage Component

**Files:**
- Create: `src/pages/AdditionPage.tsx`
- Modify: `src/App.tsx`

**Step 1: Create AdditionPage component**

Create: `src/pages/AdditionPage.tsx`
```tsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { generateAdditionSteps } from '../utils/additionGenerator';
import { AnimationStep, DifficultyLevel } from '../types';
import BlocksDisplay from '../components/BlocksDisplay';

export default function AdditionPage() {
  const { level } = useParams<{ level: string }>();
  const navigate = useNavigate();
  const [num1, setNum1] = useState('');
  const [num2, setNum2] = useState('');
  const [steps, setSteps] = useState<AnimationStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  const difficulty = (level === 'level1' || level === 'level2' ? level : 'level1') as DifficultyLevel;
  const maxNumber = difficulty === 'level1' ? 100 : 1000;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const n1 = parseInt(num1);
    const n2 = parseInt(num2);

    if (!num1.trim() || !num2.trim() || isNaN(n1) || isNaN(n2)) {
      setError('请输入两个数字');
      return;
    }

    if (n1 < 1 || n1 > maxNumber || n2 < 1 || n2 > maxNumber) {
      setError(`数字必须在1-${maxNumber}之间`);
      return;
    }

    const result = n1 + n2;
    if (result > maxNumber) {
      setError('计算结果超出范围');
      return;
    }

    const animationSteps = generateAdditionSteps(n1, n2, difficulty);
    setSteps(animationSteps);
    setCurrentStep(0);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsAnimating(false);
    }
  };

  const handleReset = () => {
    setNum1('');
    setNum2('');
    setSteps([]);
    setCurrentStep(0);
    setError('');
    setIsAnimating(false);
  };

  const handlePlay = () => {
    if (steps.length > 0) {
      setCurrentStep(0);
      setIsAnimating(true);
    }
  };

  // Auto-play animation
  useState(() => {
    if (isAnimating && currentStep < steps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 3000);
      return () => clearTimeout(timer);
    } else if (isAnimating && currentStep >= steps.length - 1) {
      setIsAnimating(false);
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/home')}
            className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50"
          >
            ← 返回
          </button>
          <h1 className="text-3xl font-comic text-primary-green">
            加法可视化 ({difficulty === 'level1' ? '1-100' : '1-1000'})
          </h1>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                第一个数
              </label>
              <input
                type="number"
                value={num1}
                onChange={(e) => setNum1(e.target.value)}
                min="1"
                max={maxNumber}
                className="w-32 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-blue focus:outline-none text-2xl text-center"
                placeholder="0"
              />
            </div>
            <span className="text-4xl text-gray-400 mb-3">+</span>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                第二个数
              </label>
              <input
                type="number"
                value={num2}
                onChange={(e) => setNum2(e.target.value)}
                min="1"
                max={maxNumber}
                className="w-32 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-blue focus:outline-none text-2xl text-center"
                placeholder="0"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3 bg-primary-green text-white rounded-lg font-comic text-xl hover:bg-green-600 active:scale-95 transition-all"
            >
              计算
            </button>
            {steps.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={handlePlay}
                  className="px-6 py-3 bg-primary-blue text-white rounded-lg font-comic hover:bg-blue-600 active:scale-95 transition-all"
                >
                  ▶ 演示
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-comic hover:bg-gray-300 active:scale-95 transition-all"
                >
                  ↺ 重置
                </button>
              </>
            )}
          </div>
          {error && <p className="text-error mt-4 text-sm">{error}</p>}
        </form>

        {/* Steps Display */}
        {steps.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="space-y-6">
              {steps.slice(0, currentStep + 1).map((step, index) => (
                <div
                  key={step.id}
                  className={`p-6 rounded-lg ${
                    index === currentStep ? 'bg-light-blue' : 'bg-gray-50'
                  }`}
                >
                  <h3 className="text-xl font-comic text-gray-800 mb-4">
                    步骤{step.id}: {step.description}
                  </h3>
                  {step.blocks && step.blocks.length > 0 && (
                    <div className="flex justify-center">
                      <BlocksDisplay blocks={step.blocks[0]} showLabels={true} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {currentStep < steps.length - 1 && (
              <button
                onClick={handleNext}
                className="w-full mt-6 px-6 py-3 bg-primary-blue text-white rounded-lg font-comic hover:bg-blue-600 active:scale-95 transition-all"
              >
                下一步 →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
```

**Step 2: Add addition route to App.tsx**

Modify: `src/App.tsx`
```tsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import NumberPage from './pages/NumberPage'
import AdditionPage from './pages/AdditionPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/number/:level"
            element={
              <ProtectedRoute>
                <NumberPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/addition/:level"
            element={
              <ProtectedRoute>
                <AdditionPage />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
```

**Step 3: Test AdditionPage**

Run: `npm run dev`

Expected: Can navigate to AdditionPage, input 27 + 15, see step-by-step visualization

**Step 4: Commit**

Run: `git add .`

Run: `git commit -m "feat: add AdditionPage with step-by-step visualization"`

---

## Task 12: Create Subtraction Animation Generator

**Files:**
- Create: `src/utils/subtractionGenerator.ts`
- Create: `src/utils/__tests__/subtractionGenerator.test.ts`

**Step 1: Write test for subtraction generator**

Create: `src/utils/__tests__/subtractionGenerator.test.ts`
```typescript
import { describe, it, expect } from 'vitest';
import { generateSubtractionSteps } from '../subtractionGenerator';

describe('generateSubtractionSteps', () => {
  it('should generate steps for simple subtraction without borrowing', () => {
    const steps = generateSubtractionSteps(58, 23, 'level1');
    expect(steps.length).toBeGreaterThan(0);
    expect(steps[steps.length - 1].description).toContain('35');
  });

  it('should generate steps for subtraction with borrowing', () => {
    const steps = generateSubtractionSteps(52, 27, 'level1');
    expect(steps.length).toBeGreaterThan(0);
    expect(steps[steps.length - 1].description).toContain('25');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- subtractionGenerator`

Expected: Tests fail

**Step 3: Implement subtraction generator**

Create: `src/utils/subtractionGenerator.ts`
```typescript
import { AnimationStep, DifficultyLevel } from '../types';
import { parseNumberToBlocks } from './numberParser';

export function generateSubtractionSteps(
  minuend: number,
  subtrahend: number,
  difficulty: DifficultyLevel
): AnimationStep[] {
  const steps: AnimationStep[] = [];
  let stepId = 1;

  // Step 1: Show minuend
  const minuendBlocks = parseNumberToBlocks(minuend, difficulty);

  steps.push({
    id: stepId++,
    description: `被减数：${minuend}`,
    blocks: [minuendBlocks],
  });

  // Step 2: Show subtrahend
  const subtrahendBlocks = parseNumberToBlocks(subtrahend, difficulty);

  steps.push({
    id: stepId++,
    description: `减数：${subtrahend}`,
    blocks: [subtrahendBlocks],
  });

  // Step 3: Check if borrowing needed
  const minuendOnes = minuend % 10;
  const subtrahendOnes = subtrahend % 10;

  if (minuendOnes < subtrahendOnes) {
    // Need to borrow
    steps.push({
      id: stepId++,
      description: `个位不够减，需要从十位借1`,
      action: 'borrow',
      highlight: ['borrow'],
    });

    const borrowedMinuendOnes = minuendOnes + 10;
    steps.push({
      id: stepId++,
      description: `借位后：${minuendOnes}个一变成${borrowedMinuendOnes}个一`,
      action: 'after_borrow',
      highlight: ['ones'],
    });
  }

  // Step 4: Subtract ones
  const onesResult = minuendOnes >= subtrahendOnes
    ? minuendOnes - subtrahendOnes
    : minuendOnes + 10 - subtrahendOnes;

  steps.push({
    id: stepId++,
    description: `个位相减：${minuendOnes >= subtrahendOnes ? minuendOnes : `${minuendOnes} + 10`} - ${subtrahendOnes} = ${onesResult}`,
    action: 'subtract_ones',
    highlight: ['ones'],
  });

  // Step 5: Subtract tens (adjusting for borrow if needed)
  const minuendTens = Math.floor(minuend / 10) % 10;
  const subtrahendTens = Math.floor(subtrahend / 10) % 10;
  const adjustedMinuendTens = minuendOnes < subtrahendOnes ? minuendTens - 1 : minuendTens;
  const tensResult = adjustedMinuendTens - subtrahendTens;

  if (tensResult > 0 || (minuendTens > 0 || subtrahendTens > 0)) {
    steps.push({
      id: stepId++,
      description: `十位相减：${adjustedMinuendTens} - ${subtrahendTens} = ${tensResult}`,
      action: 'subtract_tens',
      highlight: ['tens'],
    });
  }

  // Step 6: Handle hundreds for level2
  if (difficulty === 'level2') {
    const minuendHundreds = Math.floor(minuend / 100);
    const subtrahendHundreds = Math.floor(subtrahend / 100);
    const hundredsResult = minuendHundreds - subtrahendHundreds;

    if (hundredsResult > 0 || (minuendHundreds > 0 || subtrahendHundreds > 0)) {
      steps.push({
        id: stepId++,
        description: `百位相减：${minuendHundreds} - ${subtrahendHundreds} = ${hundredsResult}`,
        action: 'subtract_hundreds',
        highlight: ['hundreds'],
      });
    }
  }

  // Final step: Show result
  const result = minuend - subtrahend;
  const resultBlocks = parseNumberToBlocks(result, difficulty);

  steps.push({
    id: stepId++,
    description: `结果：${result}`,
    blocks: [resultBlocks],
    showResult: true,
  });

  return steps;
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- subtractionGenerator`

Expected: All tests pass

**Step 5: Commit**

Run: `git add .`

Run: `git commit -m "feat: add subtraction animation generator with tests"`

---

## Task 13: Create SubtractionPage Component

**Files:**
- Create: `src/pages/SubtractionPage.tsx`
- Modify: `src/App.tsx`

**Step 1: Create SubtractionPage component**

Create: `src/pages/SubtractionPage.tsx`
```tsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { generateSubtractionSteps } from '../utils/subtractionGenerator';
import { AnimationStep, DifficultyLevel } from '../types';
import BlocksDisplay from '../components/BlocksDisplay';

export default function SubtractionPage() {
  const { level } = useParams<{ level: string }>();
  const navigate = useNavigate();
  const [minuend, setMinuend] = useState('');
  const [subtrahend, setSubtrahend] = useState('');
  const [steps, setSteps] = useState<AnimationStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  const difficulty = (level === 'level1' || level === 'level2' ? level : 'level1') as DifficultyLevel;
  const maxNumber = difficulty === 'level1' ? 100 : 1000;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const m = parseInt(minuend);
    const s = parseInt(subtrahend);

    if (!minuend.trim() || !subtrahend.trim() || isNaN(m) || isNaN(s)) {
      setError('请输入两个数字');
      return;
    }

    if (m < 1 || m > maxNumber || s < 1 || s > maxNumber) {
      setError(`数字必须在1-${maxNumber}之间`);
      return;
    }

    if (m < s) {
      setError('被减数必须大于或等于减数');
      return;
    }

    const result = m - s;
    if (result < 1) {
      setError('结果必须大于0');
      return;
    }

    const animationSteps = generateSubtractionSteps(m, s, difficulty);
    setSteps(animationSteps);
    setCurrentStep(0);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsAnimating(false);
    }
  };

  const handleReset = () => {
    setMinuend('');
    setSubtrahend('');
    setSteps([]);
    setCurrentStep(0);
    setError('');
    setIsAnimating(false);
  };

  const handlePlay = () => {
    if (steps.length > 0) {
      setCurrentStep(0);
      setIsAnimating(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/home')}
            className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50"
          >
            ← 返回
          </button>
          <h1 className="text-3xl font-comic text-primary-green">
            减法可视化 ({difficulty === 'level1' ? '1-100' : '1-1000'})
          </h1>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                被减数
              </label>
              <input
                type="number"
                value={minuend}
                onChange={(e) => setMinuend(e.target.value)}
                min="1"
                max={maxNumber}
                className="w-32 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-blue focus:outline-none text-2xl text-center"
                placeholder="0"
              />
            </div>
            <span className="text-4xl text-gray-400 mb-3">-</span>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                减数
              </label>
              <input
                type="number"
                value={subtrahend}
                onChange={(e) => setSubtrahend(e.target.value)}
                min="1"
                max={maxNumber}
                className="w-32 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary-blue focus:outline-none text-2xl text-center"
                placeholder="0"
              />
            </div>
            <button
              type="submit"
              className="px-8 py-3 bg-primary-green text-white rounded-lg font-comic text-xl hover:bg-green-600 active:scale-95 transition-all"
            >
              计算
            </button>
            {steps.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={handlePlay}
                  className="px-6 py-3 bg-primary-blue text-white rounded-lg font-comic hover:bg-blue-600 active:scale-95 transition-all"
                >
                  ▶ 演示
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-comic hover:bg-gray-300 active:scale-95 transition-all"
                >
                  ↺ 重置
                </button>
              </>
            )}
          </div>
          {error && <p className="text-error mt-4 text-sm">{error}</p>}
        </form>

        {/* Steps Display */}
        {steps.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="space-y-6">
              {steps.slice(0, currentStep + 1).map((step, index) => (
                <div
                  key={step.id}
                  className={`p-6 rounded-lg ${
                    index === currentStep ? 'bg-light-blue' : 'bg-gray-50'
                  }`}
                >
                  <h3 className="text-xl font-comic text-gray-800 mb-4">
                    步骤{step.id}: {step.description}
                  </h3>
                  {step.blocks && step.blocks.length > 0 && (
                    <div className="flex justify-center">
                      <BlocksDisplay blocks={step.blocks[0]} showLabels={true} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {currentStep < steps.length - 1 && (
              <button
                onClick={handleNext}
                className="w-full mt-6 px-6 py-3 bg-primary-blue text-white rounded-lg font-comic hover:bg-blue-600 active:scale-95 transition-all"
              >
                下一步 →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
```

**Step 2: Add subtraction route to App.tsx**

Modify: `src/App.tsx`
```tsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import NumberPage from './pages/NumberPage'
import AdditionPage from './pages/AdditionPage'
import SubtractionPage from './pages/SubtractionPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/number/:level"
            element={
              <ProtectedRoute>
                <NumberPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/addition/:level"
            element={
              <ProtectedRoute>
                <AdditionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/subtraction/:level"
            element={
              <ProtectedRoute>
                <SubtractionPage />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
```

**Step 3: Test SubtractionPage**

Run: `npm run dev`

Expected: Can navigate to SubtractionPage, input 52 - 27, see step-by-step visualization with borrowing

**Step 4: Commit**

Run: `git add .`

Run: `git commit -m "feat: add SubtractionPage with step-by-step visualization"`

---

## Task 14: Add Auto-play Animation Hook

**Files:**
- Create: `src/hooks/useAnimation.ts`

**Step 1: Create useAnimation hook**

Create: `src/hooks/useAnimation.ts`
```typescript
import { useState, useEffect, useCallback } from 'react';

export function useAnimation(totalSteps: number, stepDuration: number = 3000) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const play = useCallback(() => {
    setCurrentStep(0);
    setIsPlaying(true);
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const reset = useCallback(() => {
    setCurrentStep(0);
    setIsPlaying(false);
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev < totalSteps - 1) {
        return prev + 1;
      }
      setIsPlaying(false);
      return prev;
    });
  }, [totalSteps]);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  }, []);

  // Auto-play effect
  useEffect(() => {
    if (isPlaying && currentStep < totalSteps - 1) {
      const timer = setTimeout(() => {
        nextStep();
      }, stepDuration);

      return () => clearTimeout(timer);
    } else if (isPlaying && currentStep >= totalSteps - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentStep, totalSteps, stepDuration, nextStep]);

  return {
    currentStep,
    isPlaying,
    play,
    pause,
    reset,
    nextStep,
    prevStep,
    setCurrentStep,
  };
}
```

**Step 2: Update AdditionPage to use useAnimation**

Modify: `src/pages/AdditionPage.tsx`
```tsx
// Replace the useState animation logic with:
import { useAnimation } from '../hooks/useAnimation';

// In component:
const { currentStep, isPlaying, play, reset, nextStep } = useAnimation(steps.length, 3000);

// Update the component to use these hook methods instead of local state
```

**Step 3: Commit**

Run: `git add .`

Run: `git commit -m "feat: add useAnimation hook for auto-play functionality"`

---

## Task 15: Add Responsive Design and Mobile Support

**Files:**
- Modify: `src/pages/HomePage.tsx`
- Modify: `src/pages/NumberPage.tsx`
- Modify: `src/pages/AdditionPage.tsx`
- Modify: `src/pages/SubtractionPage.tsx`

**Step 1: Update Tailwind config for mobile**

Modify: `tailwind.config.js`
```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '480px',
      },
      colors: {
        primary: {
          green: '#4CAF50',
          blue: '#2196F3',
        },
        // ... rest of config
      },
      // ... rest of config
    },
  },
  plugins: [],
}
```

**Step 2: Ensure buttons are at least 44px for mobile**

Add `min-h-[44px]` class to all interactive elements across pages

**Step 3: Test on mobile viewport**

Run: `npm run dev`

Open browser DevTools, toggle mobile view, test all pages

**Step 4: Commit**

Run: `git add .`

Run: `git commit -m "feat: add responsive design for mobile devices"`

---

## Task 16: Add Input Validation Utilities

**Files:**
- Create: `src/utils/validator.ts`
- Create: `src/utils/__tests__/validator.test.ts`

**Step 1: Write validator tests**

Create: `src/utils/__tests__/validator.test.ts`
```typescript
import { describe, it, expect } from 'vitest';
import { validateNumber, validateEquation } from '../validator';

describe('validateNumber', () => {
  it('should validate numbers in range', () => {
    expect(validateNumber('37', 'level1')).toEqual({ valid: true, value: 37 });
    expect(validateNumber('345', 'level2')).toEqual({ valid: true, value: 345 });
  });

  it('should reject empty input', () => {
    expect(validateNumber('', 'level1')).toEqual({ valid: false, error: '请输入数字' });
  });

  it('should reject out of range numbers', () => {
    expect(validateNumber('150', 'level1')).toEqual({ valid: false, error: '数字必须在1-100之间' });
  });
});

describe('validateEquation', () => {
  it('should validate simple addition', () => {
    expect(validateEquation('27', '15', '+', 'level1')).toEqual({ valid: true });
  });

  it('should reject invalid input', () => {
    expect(validateEquation('abc', '15', '+', 'level1')).toEqual({ valid: false, error: '请输入有效的数字' });
  });

  it('should reject results out of range', () => {
    expect(validateEquation('99', '50', '+', 'level1')).toEqual({ valid: false, error: '计算结果超出范围' });
  });
});
```

**Step 2: Implement validator**

Create: `src/utils/validator.ts`
```typescript
import { DifficultyLevel } from '../types';

export function validateNumber(input: string, difficulty: DifficultyLevel) {
  if (!input.trim()) {
    return { valid: false, error: '请输入数字' };
  }

  const num = parseInt(input);

  if (isNaN(num)) {
    return { valid: false, error: '请输入有效的数字' };
  }

  const maxNumber = difficulty === 'level1' ? 100 : 1000;

  if (num < 1 || num > maxNumber) {
    return { valid: false, error: `数字必须在1-${maxNumber}之间` };
  }

  return { valid: true, value: num };
}

export function validateEquation(
  num1Str: string,
  num2Str: string,
  operator: '+' | '-',
  difficulty: DifficultyLevel
) {
  const validation1 = validateNumber(num1Str, difficulty);
  const validation2 = validateNumber(num2Str, difficulty);

  if (!validation1.valid) {
    return { valid: false, error: validation1.error };
  }

  if (!validation2.valid) {
    return { valid: false, error: validation2.error };
  }

  const num1 = validation1.value!;
  const num2 = validation2.value!;
  const maxNumber = difficulty === 'level1' ? 100 : 1000;

  if (operator === '+') {
    const result = num1 + num2;
    if (result > maxNumber) {
      return { valid: false, error: '计算结果超出范围' };
    }
  } else {
    if (num1 < num2) {
      return { valid: false, error: '被减数必须大于或等于减数' };
    }
    const result = num1 - num2;
    if (result < 1) {
      return { valid: false, error: '结果必须大于0' };
    }
  }

  return { valid: true };
}
```

**Step 3: Run tests**

Run: `npm test`

Expected: All tests pass

**Step 4: Commit**

Run: `git add .`

Run: `git commit -m "feat: add input validation utilities with tests"`

---

## Task 17: Final Testing and Documentation

**Files:**
- Create: `README.md`

**Step 1: Create comprehensive README**

Create: `README.md`
```markdown
# 数学学习应用 - Math Learning App

帮助5-8岁儿童理解数字和加减法运算的网页应用。

## 功能特性

- 🔢 数字可视化：理解数字的位值概念
- ➕ 加法可视化：逐步展示加法运算过程
- ➖ 减法可视化：逐步展示减法运算过程（含借位）
- 📊 两个难度级别：1-100 和 1-1000
- 🎨 Base-10 Blocks 可视化
- 🎬 慢速动画演示
- 👨‍🎓 简单登录验证

## 技术栈

- React 18 + TypeScript
- Vite
- React Router v6
- Tailwind CSS
- Framer Motion

## 安装和运行

\`\`\`bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 运行测试
npm test

# 构建生产版本
npm run build
\`\`\`

## 测试账号

- student1 / math123
- student2 / learn456

## 项目结构

\`\`\`
src/
├── pages/          # 页面组件
├── components/     # 可复用组件
├── hooks/          # 自定义 Hooks
├── utils/          # 工具函数
├── contexts/       # Context
└── types/          # TypeScript 类型定义
\`\`\`

## 部署

可以部署到任何静态托管服务：
- Vercel
- Netlify
- GitHub Pages
\`\`\`bash
npm run build
# 部署 dist/ 目录
\`\`\`
```

**Step 2: Run all tests**

Run: `npm test`

Expected: All tests pass

**Step 3: Build production version**

Run: `npm run build`

Expected: Build succeeds without errors

**Step 4: Final commit**

Run: `git add .`

Run: `git commit -m "docs: add README and finalize implementation"`

---

## Task 18: Deploy to Production

**Step 1: Build for production**

Run: `npm run build`

**Step 2: Test production build locally**

Run: `npm run preview`

Expected: Application works in production mode

**Step 3: Commit final version**

Run: `git add .`

Run: `git commit -m "release: version 1.0.0 ready for production"`

**Step 4: Create git tag**

Run: `git tag -a v1.0.0 -m "Release version 1.0.0"`

Run: `git push origin v1.0.0`

---

## Summary

This implementation plan breaks down the math learning application into 18 bite-sized tasks, each following TDD principles with tests written before implementation. The plan includes:

✅ Complete project setup with Vite + React + TypeScript
✅ Authentication system with localStorage
✅ Three main features: Number, Addition, Subtraction visualization
✅ Base-10 Blocks components
✅ Animation generators with step-by-step visualization
✅ Input validation and error handling
✅ Responsive design for mobile devices
✅ Comprehensive testing strategy
✅ Production-ready deployment

Each task is designed to be completed in 2-5 minutes, with frequent commits to maintain a clean git history.
