"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, EyeOff, LogIn, ArrowRight, User, Store, Settings, Shield } from 'lucide-react'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClientComponentClient()

  // Demo user accounts for quick login
  const demoUsers = [
    {
      type: 'user',
      title: 'عميل',
      description: 'مستخدم عادي يبحث عن خدمات البناء',
      email: 'user@binaa.com',
      password: 'demo123',
      icon: User,
      color: 'from-blue-500 to-blue-600',
      route: '/user/dashboard'
    },
    {
      type: 'store',
      title: 'متجر',
      description: 'صاحب متجر لبيع مواد البناء',
      email: 'store@binaa.com',
      password: 'demo123',
      icon: Store,
      color: 'from-green-500 to-green-600',
      route: '/store/dashboard'
    },
    {
      type: 'service_provider',
      title: 'مقدم خدمة',
      description: 'مقاول أو حرفي متخصص',
      email: 'service@binaa.com',
      password: 'demo123',
      icon: Settings,
      color: 'from-purple-500 to-purple-600',
      route: '/service-provider/dashboard'
    },
    {
      type: 'admin',
      title: 'مدير',
      description: 'مدير النظام والإشراف',
      email: 'admin@binaa.com',
      password: 'demo123',
      icon: Shield,
      color: 'from-red-500 to-red-600',
      route: '/admin/dashboard'
    }
  ]

  const handleDemoLogin = async (demoUser: typeof demoUsers[0]) => {
    setError('')
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: demoUser.email,
        password: demoUser.password,
      })

      if (error) {
        setError(`خطأ في تسجيل الدخول: ${error.message}. يرجى التأكد من إعدادات Supabase أو استخدام النموذج العادي.`)
        return
      }

      if (data.user) {
        router.push(demoUser.route)
      }
    } catch (err) {
      setError(`حدث خطأ أثناء تسجيل الدخول التجريبي: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError('بيانات الدخول غير صحيحة')
        return
      }

      if (data.user) {
        // Get user profile to determine dashboard route
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('user_type')
          .eq('user_id', data.user.id)
          .single()

        // Redirect based on user type
        if (profile?.user_type) {
          switch (profile.user_type) {
            case 'service-provider':
            case 'service_provider':
              router.push('/service-provider/dashboard')
              break
            case 'store':
            case 'store_owner':
              router.push('/store/dashboard')
              break
            case 'admin':
              router.push('/admin/dashboard')
              break
            case 'user':
            case 'customer':
            default:
              router.push('/user/dashboard')
          }
        } else {
          router.push('/user/dashboard')
        }
      }
    } catch (err) {
      setError('حدث خطأ أثناء تسجيل الدخول')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl space-y-8">
        {/* Main Login Card */}
        <Card className="w-full max-w-md mx-auto">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

        {/* Demo User Cards */}
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">تجربة سريعة</h3>
            <p className="text-sm text-gray-500">اختر نوع المستخدم للدخول التجريبي</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {demoUsers.map((user, index) => {
              const IconComponent = user.icon
              return (
                <Card 
                  key={index} 
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-300"
                  onClick={() => handleDemoLogin(user)}
                >
                  <CardContent className="p-6 text-center space-y-4">
                    <div className={`mx-auto w-12 h-12 bg-gradient-to-r ${user.color} rounded-full flex items-center justify-center`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{user.title}</h4>
                      <p className="text-xs text-gray-600 mb-3">{user.description}</p>
                      <div className="text-xs text-gray-400 space-y-1">
                        <div dir="ltr">{user.email}</div>
                        <div>كلمة المرور: {user.password}</div>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="w-full"
                      disabled={loading}
                    >
                      دخول تجريبي
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
