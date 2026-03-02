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
              onSelect={() => navigate('/number/level1')}
            />
            <FeatureCard
              emoji="➕"
              title="加法"
              subtitle="可视化"
              onSelect={() => navigate('/addition/level1')}
            />
            <FeatureCard
              emoji="➖"
              title="减法"
              subtitle="可视化"
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
  onSelect,
}: {
  emoji: string;
  title: string;
  subtitle: string;
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
