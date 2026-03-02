export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
        测试页面
      </h1>
      <p className="text-center text-lg text-gray-600 mb-4">
        如果你能看到这个，说明 React 和路由都正常工作
      </p>
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">测试 Blocks 组件</h2>
        <div className="flex gap-4 flex-wrap">
          <div className="w-10 h-10 bg-blue-500 rounded"></div>
          <div className="w-20 h-10 bg-green-500 rounded"></div>
          <div className="w-20 h-20 bg-orange-500 rounded"></div>
        </div>
      </div>
    </div>
  );
}
