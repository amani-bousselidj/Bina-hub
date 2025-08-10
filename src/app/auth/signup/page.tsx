"use client";

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { Badge } from '@/components/ui'
import { 
  User, 
  Building2, 
  Truck, 
  Store,
  UserCheck,
  ArrowRight,
  ArrowLeft
} from 'lucide-react'

type UserType = 'user' | 'service-provider' | 'store' | 'admin'

interface UserTypeOption {
  value: UserType
  label: string
  description: string
  icon: any
  color: string
  features: string[]
}

const userTypes: UserTypeOption[] = [
  {
    value: 'user',
    label: 'مستخدم عادي',
    description: 'للأفراد الباحثين عن خدمات البناء',
    icon: User,
    color: 'from-blue-500 to-blue-600',
    features: ['إدارة المشاريع', 'حاسبة التكاليف', 'طلب الخدمات', 'متابعة التقدم']
  },
  {
    value: 'service-provider',
    label: 'مقدم خدمة',
    description: 'للمقاولين ومكاتب التصميم وموردي المواد',
    icon: Building2,
    color: 'from-green-500 to-green-600',
    features: ['لوحة تحكم متخصصة', 'إدارة الحجوزات', 'متابعة الطلبات', 'تقارير الأداء']
  },
  {
    value: 'store',
    label: 'متجر',
    description: 'لأصحاب المتاجر ونقاط البيع',
    icon: Store,
    color: 'from-purple-500 to-purple-600',
    features: ['نظام نقاط البيع', 'إدارة المخزون', 'تقارير المبيعات', 'إدارة العملاء']
  },
  {
    value: 'admin',
    label: 'مدير النظام',
    description: 'للإدارة والإشراف على المنصة',
    icon: UserCheck,
    color: 'from-red-500 to-red-600',
    features: ['إدارة شاملة', 'تحليلات متقدمة', 'إدارة المستخدمين', 'تقارير النظام']
  }
]

export default function SignupForm() {
  const [step, setStep] = useState<'type-selection' | 'form'>('type-selection')
  const [selectedUserType, setSelectedUserType] = useState<UserType | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleUserTypeSelect = (userType: UserType) => {
    setSelectedUserType(userType)
    setStep('form')
  }

  const handleBackToSelection = () => {
    setStep('type-selection')
    setSelectedUserType(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (password !== confirmPassword) {
      setError('كلمات المرور غير متطابقة')
      return
    }
    
    if (password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل')
      return
    }

    if (!selectedUserType) {
      setError('يرجى اختيار نوع الحساب')
      return
    }

    setLoading(true)
    
    try {
      // Create user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone,
            user_type: selectedUserType
          }
        }
      })

      if (authError) {
        setError('حدث خطأ في إنشاء الحساب: ' + authError.message)
        return
      }

      if (authData.user) {
        // Create user profile in database
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: authData.user.id,
            email: email,
            full_name: fullName,
            phone: phone,
            user_type: selectedUserType,
            created_at: new Date().toISOString()
          })

        if (profileError) {
          console.error('Error creating profile:', profileError)
          // Continue anyway, profile might already exist
        }

        // Redirect based on user type
        switch (selectedUserType) {
          case 'user':
            router.push('/user/dashboard')
            break
          case 'service-provider':
            router.push('/service-provider/dashboard')
            break
          case 'store':
            router.push('/store/dashboard')
            break
          case 'admin':
            router.push('/admin/dashboard')
            break
          default:
            router.push('/user/dashboard')
        }
      }
    } catch (err) {
      setError('حدث خطأ في إنشاء الحساب')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'type-selection') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              انضم إلى منصة بنّا
            </h1>
            <p className="text-xl text-gray-600">
              اختر نوع حسابك لتبدأ رحلتك معنا
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userTypes.map((userType) => {
              const IconComponent = userType.icon
              return (
                <Card 
                  key={userType.value}
                  className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 hover:border-blue-300"
                  onClick={() => handleUserTypeSelect(userType.value)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4 space-x-reverse mb-4">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${userType.color} flex items-center justify-center`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {userType.label}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {userType.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-800 text-sm">المميزات المتاحة:</h4>
                      {userType.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2 space-x-reverse">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                          <span className="text-sm text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <Badge variant="secondary" className="text-xs">
                        ابدأ مجاناً
                      </Badge>
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
          
          <div className="text-center mt-8">
            <p className="text-sm text-gray-600">
              لديك حساب بالفعل؟{' '}
              <Button
                variant="link"
                onClick={() => router.push('/auth/login')}
                className="text-blue-600 hover:text-blue-700 p-0 h-auto"
              >
                تسجيل الدخول
              </Button>
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Form step
  const selectedType = userTypes.find(t => t.value === selectedUserType)
  const IconComponent = selectedType?.icon || User

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToSelection}
              className="absolute right-4 top-4"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${selectedType?.color} flex items-center justify-center`}>
              <IconComponent className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">
            إنشاء حساب {selectedType?.label}
          </CardTitle>
          <p className="text-gray-600 mt-2">
            {selectedType?.description}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الاسم الكامل
                </label>
                <Input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full"
                  placeholder="أدخل اسمك الكامل"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  رقم الهاتف
                </label>
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full"
                  placeholder="05xxxxxxxx"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  البريد الإلكتروني
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                  placeholder="أدخل بريدك الإلكتروني"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  كلمة المرور
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full"
                  placeholder="أدخل كلمة المرور"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  تأكيد كلمة المرور
                </label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full"
                  placeholder="أكد كلمة المرور"
                />
              </div>
            </div>
            
            <Button
              type="submit"
              className={`w-full bg-gradient-to-r ${selectedType?.color} hover:opacity-90 text-white`}
              disabled={loading}
            >
              {loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
            </Button>
            
            <div className="text-center">
              <p className="text-sm text-gray-600">
                لديك حساب بالفعل؟{' '}
                <Button
                  variant="link"
                  onClick={() => router.push('/auth/login')}
                  className="text-blue-600 hover:text-blue-700 p-0 h-auto"
                >
                  تسجيل الدخول
                </Button>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}




