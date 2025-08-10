export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="auth-layout">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">BINNA</h1>
              <p className="text-gray-600 mt-2">Construction Platform</p>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}


