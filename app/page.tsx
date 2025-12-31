export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🚀 Enterprise Resource Request System
          </h1>
          <p className="text-gray-600 text-lg">
            Next.js Frontend - Ready for Implementation
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <div className="flex items-center">
              <span className="text-2xl mr-3">✅</span>
              <div>
                <p className="font-semibold text-green-800">Frontend Running</p>
                <p className="text-green-700 text-sm">Next.js 16 with TypeScript & Tailwind CSS</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <div className="flex items-center">
              <span className="text-2xl mr-3">📦</span>
              <div>
                <p className="font-semibold text-blue-800">Dependencies Installed</p>
                <p className="text-blue-700 text-sm">axios, @heroicons/react, date-fns, zustand</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
            <div className="flex items-center">
              <span className="text-2xl mr-3">🔧</span>
              <div>
                <p className="font-semibold text-purple-800">Environment Configured</p>
                <p className="text-purple-700 text-sm">API URL: http://localhost:5500/api/v1</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">📋 Next Steps</h2>
          <ol className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="font-bold mr-2">1.</span>
              <span>Review the <code className="bg-gray-200 px-2 py-1 rounded text-sm">frontend_guide.md</code> artifact</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">2.</span>
              <span>Create the directory structure (lib, services, components, types)</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">3.</span>
              <span>Copy the provided code for login, dashboard, and components</span>
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">4.</span>
              <span>Start with the login page: <code className="bg-gray-200 px-2 py-1 rounded text-sm">app/(auth)/login/page.tsx</code></span>
            </li>
          </ol>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <a
            href="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition text-center font-semibold shadow-md"
          >
            Go to Login →
          </a>
          <a
            href="/dashboard"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition text-center font-semibold shadow-md"
          >
            Go to Dashboard →
          </a>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Backend API: <span className="font-mono bg-gray-100 px-2 py-1 rounded">http://localhost:5500</span></p>
          <p className="mt-1">Frontend: <span className="font-mono bg-gray-100 px-2 py-1 rounded">http://localhost:3000</span></p>
        </div>
      </div>
    </div>
  );
}
