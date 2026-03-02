import { useState } from 'react';

export default function SimpleAdditionPage() {
  const [num1, setNum1] = useState(27);
  const [num2, setNum2] = useState(15);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          加法可视化
        </h1>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {num1} + {num2} = ?
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              第一个数
            </label>
            <input
              type="number"
              value={num1}
              onChange={(e) => setNum1(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              第二个数
            </label>
            <input
              type="number"
              value={num2}
              onChange={(e) => setNum2(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="text-center text-2xl font-bold text-gray-800">
            结果: {num1 + num2}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Blocks 可视化</h2>
          <div className="flex gap-4 flex-wrap justify-center">
            {/* 显示 num1 的 blocks */}
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2">{num1}:</div>
              <div className="flex gap-2">
                {Array(Math.floor(num1 / 10)).fill(null).map((_, i) => (
                  <div key={i} className="w-20 h-10 bg-green-500 rounded border-2 border-green-700"></div>
                ))}
                {num1 % 10 > 0 && Array(num1 % 10).fill(null).map((_, i) => (
                  <div key={i} className="w-2 h-10 bg-blue-500 rounded border-2 border-blue-700"></div>
                ))}
              </div>
            </div>

            <div className="text-4xl font-bold text-gray-400">+</div>

            {/* 显示 num2 的 blocks */}
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2">{num2}:</div>
              <div className="flex gap-2">
                {Array(Math.floor(num2 / 10)).fill(null).map((_, i) => (
                  <div key={i} className="w-20 h-10 bg-green-500 rounded border-2 border-green-700"></div>
                ))}
                {num2 % 10 > 0 && Array(num2 % 10).fill(null).map((_, i) => (
                  <div key={i} className="w-2 h-10 bg-blue-500 rounded border-2 border-blue-700"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
