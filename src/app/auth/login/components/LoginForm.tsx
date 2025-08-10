"use client";

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, EyeOff, LogIn, ArrowRight } from 'lucide-react'
import { authService } from '../../services/authService'
import type { LoginFormData } from '../../types'

export default function LoginForm() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await authService.signIn(formData.email, formData.password)

      if (!result.success) {
        setError(result.error || 'بيانات الدخول غير صحيحة')
        return
      }

      if (result.user) {
        // Get user profile to determine dashboard route
        const { profile } = await authService.getUserProfile(result.user.id)
        
        const userType = profile?.user_type || 'user'
        const dashboardRoute = authService.getDashboardRoute(userType)
        router.push(dashboardRoute)
      }
    } catch (err) {
      setError('حدث خطأ أثناء تسجيل الدخول')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            تسجيل الدخول
          </CardTitle>
          <p className="text-gray-600">
            مرحباً بك في منصة بنا للبناء والتشييد
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-700">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                البريد الإلكتروني
              </label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="example@email.com"
                required
                className="text-left"
                dir="ltr"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                كلمة المرور
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder="••••••••"
                  required
                  className="text-left pr-10"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
            >
              {loading ? (
                "جاري تسجيل الدخول..."
              ) : (
                <>
                  تسجيل الدخول
                  <ArrowRight className="mr-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="text-center space-y-2">
            <Link 
              href="/auth/forgot-password" 
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              نسيت كلمة المرور؟
            </Link>
            <div className="text-sm text-gray-600">
              ليس لديك حساب؟{' '}
              <Link 
                href="/auth/signup" 
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                إنشاء حساب جديد
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
