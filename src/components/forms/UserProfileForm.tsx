// @ts-nocheck
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const TRADES = [
  { value: 'mason', label: 'عامل بناء' },
  { value: 'concrete', label: 'فني خرسانة' },
  { value: 'steel', label: 'فني حديد' },
  { value: 'carpenter', label: 'نجار' },
  { value: 'plumber', label: 'سباك' },
  { value: 'electrician', label: 'كهربائي' },
  { value: 'tiler', label: 'مبلط' },
  { value: 'flooring', label: 'فني أرضيات' },
  { value: 'roofer', label: 'فني أسطح' },
  { value: 'plasterer', label: 'مبيض محارة' },
  { value: 'drywaller', label: 'عامل جبس' },
];

const REGIONS = [
  { value: '', label: 'اختر المنطقة' },
  { value: 'riyadh', label: 'الرياض' },
  { value: 'makkah', label: 'مكة المكرمة' },
  { value: 'eastern', label: 'المنطقة الشرقية' },
];

const CITIES = {
  riyadh: [
    { value: '', label: 'اختر المدينة' },
    { value: 'riyadh', label: 'الرياض' },
    { value: 'diriyah', label: 'الدرعية' },
  ],
  makkah: [
    { value: '', label: 'اختر المدينة' },
    { value: 'makkah', label: 'مكة' },
    { value: 'jeddah', label: 'جدة' },
  ],
  eastern: [
    { value: '', label: 'اختر المدينة' },
    { value: 'dammam', label: 'الدمام' },
    { value: 'khobar', label: 'الخبر' },
  ],
};

const COUNTRY_CODES = [
  { value: '+966', label: '🇸🇦 السعودية +966', country: 'Saudi Arabia' },
  { value: '+971', label: '🇦🇪 الإمارات +971', country: 'UAE' },
  { value: '+974', label: '🇶🇦 قطر +974', country: 'Qatar' },
  { value: '+973', label: '🇧🇭 البحرين +973', country: 'Bahrain' },
  { value: '+965', label: '🇰🇼 الكويت +965', country: 'Kuwait' },
  { value: '+968', label: '🇴🇲 عمان +968', country: 'Oman' },
];

export default function UserProfileForm({ user }: { user: any }) {
  // Early return if user is null or undefined
  if (!user) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">جاري تحميل بيانات المستخدم...</p>
      </div>
    );
  }

  const supabase = createClientComponentClient();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [emailVerified, setEmailVerified] = useState(user?.email_verified || false);
  const [countryCode, setCountryCode] = useState(user?.country_code || '+966');
  const [phone, setPhone] = useState(user?.phone || '');
  const [phoneVerified, setPhoneVerified] = useState(user?.phone_verified || false);
  const [role, setRole] = useState(user?.role || '');
  const [trades, setTrades] = useState(user?.trades || []);
  const [region, setRegion] = useState(user?.region || '');
  const [city, setCity] = useState(user?.city || '');
  const [neighborhood, setNeighborhood] = useState(user?.neighborhood || '');
  const [location, setLocation] = useState(user?.location || null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [storeRequestSent, setStoreRequestSent] = useState(false);
  const [emailVerificationStep, setEmailVerificationStep] = useState<'idle' | 'sent' | 'verifying' | 'verified'>(emailVerified ? 'verified' : 'idle');
  const [emailCode, setEmailCode] = useState('');
  const [phoneVerificationStep, setPhoneVerificationStep] = useState<'idle' | 'sent' | 'verifying' | 'verified'>(phoneVerified ? 'verified' : 'idle');
  const [phoneCode, setPhoneCode] = useState('');
  const [apiLoading, setApiLoading] = useState(false);

  // Invitation code state
  const [invitationCode, setInvitationCode] = useState<string | null>(null);
  // Fetch invitation code on mount
  useEffect(() => {
    if (user && user.id) {
      const supabase = createClientComponentClient();
      supabase
        .from('users')
        .select('invitation_code')
        .eq('id', user.id)
        .single()
        .then(({ data }) => {
          if (data?.invitation_code) setInvitationCode(data.invitation_code);
        });
    } else {
      // For temp users, generate a temp invitation code
      const tempCode = `BinnaHub-TEMP-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
      setInvitationCode(tempCode);
    }
  }, [user]);

  // Handle geolocation via browser
  const handleLocate = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setSuccess('تم تحديد الموقع بنجاح عبر GPS');
      },
      () => setError('تعذر تحديد الموقع عبر GPS')
    );
  };

  // Handle location fetch via National Address API
  const handleNationalAddress = async () => {
    setApiLoading(true);
    setError(null);
    setSuccess(null);    try {
      const response = await fetch('http://apina.address.gov.sa/NationalAddress/v3.1/maps/map-engine', {
        method: 'GET',
        headers: {
          'Ocp-Apim-Subscription-Key': process.env.NEXT_PUBLIC_ADDRESS_API_KEY || '',
          'Content-Type': 'application/json',
        },
        // If the API requires query parameters like region/city, uncomment and adjust:
        // mode: 'cors', // Enable if CORS is needed
        // Example with query params:
        // 'http://apina.address.gov.sa/NationalAddress/v3.1/maps/map-engine?region=riyadh&city=riyadh&subscription-key=' + process.env.NEXT_PUBLIC_ADDRESS_API_KEY
      });

      if (!response.ok) {
        throw new Error(`فشل طلب API: ${response.status}`);
      }

      const data = await response.json();
      // Assuming the API returns coordinates in the format { lat, lng }
      // Adjust based on actual API response structure
      if (data && data.lat && data.lng) {
        setLocation({ lat: data.lat, lng: data.lng });
        setSuccess('تم جلب الموقع من العنوان الوطني بنجاح');
        // Optionally update other fields like neighborhood, city, or region if API provides them
        if (data.neighborhood) setNeighborhood(data.neighborhood);
        if (data.city) setCity(data.city);
        if (data.region) setRegion(data.region);
      } else {
        setError('بيانات الموقع غير متوفرة من API');
      }
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء جلب الموقع من العنوان الوطني');
      // Fallback to opening the map in a new tab
      window.open(`http://apina.address.gov.sa/NationalAddress/v3.1/maps/map-engine?subscription-key=${process.env.NEXT_PUBLIC_ADDRESS_API_KEY}`, '_blank');
    } finally {
      setApiLoading(false);
    }
  };

  // Simulate sending code (replace with real API integration)
  const handleVerifyEmail = async () => {
    setEmailVerificationStep('sent');
    setSuccess('تم إرسال رمز التحقق إلى بريدك الإلكتروني');
  };
  const handleConfirmEmailCode = async () => {
    if (emailCode === '1234') {
      setEmailVerificationStep('verified');
      setSuccess('تم التحقق من البريد الإلكتروني بنجاح');
    } else {
      setError('رمز التحقق غير صحيح');
    }
  };
  const handleVerifyPhone = async () => {
    setPhoneVerificationStep('sent');
    setSuccess('تم إرسال رمز التحقق إلى رقم الجوال');
  };
  const handleConfirmPhoneCode = async () => {
    if (phoneCode === '5678') {
      setPhoneVerificationStep('verified');
      setSuccess('تم التحقق من رقم الجوال بنجاح');
    } else {
      setError('رمز التحقق غير صحيح');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    // Validate name
    if (!name.trim()) {
      setError('يرجى إدخال الاسم');
      return;
    }
    
    // Validate email
    if (!email.trim() || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError('يرجى إدخال بريد إلكتروني صحيح');
      return;
    }
    
    // Validate phone
    if (!phone.trim() || phone.length < 8) {
      setError('يرجى إدخال رقم هاتف صحيح');
      return;
    }
    
    // Enhanced phone validation
    const cleanPhone = phone.replace(/\D/g, '');
    const phoneValidation = validatePhone(cleanPhone, countryCode);
    if (!phoneValidation.valid) {
      setError(phoneValidation.error);
      return;
    }
    
    // Validate role
    if (!role) {
      setError('يرجى اختيار الدور');
      return;
    }
    
    // Validate trades for workers
    if (role === 'worker' && trades.length === 0) {
      setError('يرجى اختيار تخصص واحد على الأقل');
      return;
    }
    
    // Validate location
    if (!region || !city) {
      setError('يرجى تحديد المنطقة والمدينة');
      return;
    }
    
    setSaving(true);
    try {
      // Helper function to get cookie value
      const getCookie = (name: string) => {
        if (typeof document === 'undefined') return null;
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
        return null;
      };
      
      // Helper function to set cookie value
      const setCookie = (name: string, value: string) => {
        if (typeof document === 'undefined') return;
        document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=86400; SameSite=Strict`;
      };
      
      // Check if this is a temp user
      const tempAuthCookie = getCookie('temp_auth_user');
      if (tempAuthCookie) {
        // For temp users, update the cookie and show success
        const currentTempUser = JSON.parse(decodeURIComponent(tempAuthCookie));
        const updatedTempUser = {
          ...currentTempUser,
          name,
          email,
          country_code: countryCode,
          phone: cleanPhone,
          role,
          region,
          city,
          neighborhood,
          updated_at: new Date().toISOString(),
        };
        setCookie('temp_auth_user', JSON.stringify(updatedTempUser));
        setSuccess('تم حفظ التغييرات مؤقتاً (سيتم حفظها نهائياً عند إنشاء حساب)');
        setSaving(false);
        return;
      }

      // For Supabase users, proceed with database operations
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) throw new Error('يرجى تسجيل الدخول');
      
      // Update email if changed
      if (authUser.email !== email) {
        const { error: emailErr } = await supabase.auth.updateUser({ email });
        if (emailErr) throw emailErr;
      }
      
      // Save to users table
      const userUpdateData = {
        name,
        email,
        country_code: countryCode,
        phone: cleanPhone, // Save cleaned phone number
        role,
        region,
        city,
        neighborhood,
        updated_at: new Date().toISOString(),
      };
      
      const { error: userError } = await supabase
        .from('users')
        .update(userUpdateData)
        .eq('id', authUser.id);
      if (userError) throw userError;

      // Supervisor activation logic
      if (role === 'supervisor') {
        // Upsert supervisor record
        const { error: supervisorError } = await supabase
          .from('construction_supervisors')
          .upsert({
            user_id: authUser.id,
            full_name: name,
            phone: `${countryCode}${cleanPhone}`, // Save full phone number
            email: email,
            area: city,
            is_available: true,
            is_verified: false,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id' });
        if (supervisorError) throw supervisorError;
      }
      
      setSuccess('تم حفظ التغييرات بنجاح');
    } catch (e: any) {
      setError(e.message || 'حدث خطأ أثناء الحفظ');
    } finally {
      setSaving(false);
    }
  };

  // Phone validation function
  const validatePhone = (phone: string, countryCode: string) => {
    const rules: { [key: string]: { pattern: RegExp; length: number; name: string } } = {
      '+966': { pattern: /^5\d{8}$/, length: 9, name: 'السعودية' },
      '+971': { pattern: /^[45236789]\d{8}$/, length: 9, name: 'الإمارات' },
      '+974': { pattern: /^[3567]\d{7}$/, length: 8, name: 'قطر' },
      '+973': { pattern: /^[36]\d{7}$/, length: 8, name: 'البحرين' },
      '+965': { pattern: /^[569]\d{7}$/, length: 8, name: 'الكويت' },
      '+968': { pattern: /^[79]\d{7}$/, length: 8, name: 'عمان' },
    };

    const rule = rules[countryCode];
    if (!rule) {
      return { valid: false, error: 'رمز الدولة غير مدعوم' };
    }

    if (phone.length !== rule.length) {
      return {
        valid: false,
        error: `رقم الهاتف يجب أن يتكون من ${rule.length} أرقام للدولة ${rule.name}`,
      };
    }

    if (!rule.pattern.test(phone)) {
      let hint = '';
      switch (countryCode) {
        case '+966':
          hint = 'يجب أن يبدأ برقم 5';
          break;
        case '+971':
          hint = 'يجب أن يبدأ برقم 4، 5، 2، 3، 6، 7، 8، أو 9';
          break;
        case '+974':
          hint = 'يجب أن يبدأ برقم 3، 5، 6، أو 7';
          break;
        case '+973':
          hint = 'يجب أن يبدأ برقم 3 أو 6';
          break;
        case '+965':
          hint = 'يجب أن يبدأ برقم 5، 6، أو 9';
          break;
        case '+968':
          hint = 'يجب أن يبدأ برقم 7 أو 9';
          break;
      }
      return { valid: false, error: `رقم الهاتف غير صحيح للدولة ${rule.name}. ${hint}` };
    }

    return { valid: true, error: null };
  };

  return (
    <form dir="rtl" className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-8 space-y-6" onSubmit={handleSave}>
      <h2 className="text-2xl font-bold mb-4 text-blue-700">الملف الشخصي</h2>
      {name && (
        <div className="mb-4 text-lg font-semibold text-green-700">مرحباً، {name} 👋</div>
      )}
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{success}</div>}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">الاسم الكامل</label>
        <Input
          value={name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
          placeholder="أدخل اسمك الكامل"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 items-end">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">البريد الإلكتروني</label>
            <Input
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              placeholder="أدخل بريدك الإلكتروني"
              type="email"
              required
              disabled={emailVerificationStep === 'verified'}
            />
          </div>
          {emailVerificationStep === 'idle' && (
            <Button type="button" variant="secondary" onClick={handleVerifyEmail}>
              تحقق من البريد الإلكتروني
            </Button>
          )}
          {emailVerificationStep === 'sent' && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">رمز التحقق</label>
                <Input
                  value={emailCode}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmailCode(e.target.value)}
                  placeholder="أدخل رمز التحقق"
                />
              </div>
              <Button type="button" variant="primary" onClick={handleConfirmEmailCode}>
                تأكيد
              </Button>
            </>
          )}
          {emailVerificationStep === 'verified' && (
            <span className="text-green-600 font-bold">تم التحقق</span>
          )}
        </div>
        <div className="flex gap-2 items-end">
          <div className="flex flex-col">
            <label className="block text-sm font-medium text-gray-700 mb-1">رمز الدولة</label>
            <select
              className="border rounded-lg px-3 py-2 text-sm bg-white border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={countryCode}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCountryCode(e.target.value)}
              style={{ minWidth: 140 }}
              required
            >
              {COUNTRY_CODES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">رقم الجوال</label>
              <Input
                value={phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
                placeholder="5xxxxxxxx"
                type="tel"
                required
                disabled={phoneVerificationStep === 'verified'}
                style={{ direction: 'ltr', textAlign: 'right' }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">أدخل الرقم بدون الصفر الأول (مثال: 512345678)</p>
          </div>
          {phoneVerificationStep === 'idle' && (
            <Button type="button" variant="secondary" onClick={handleVerifyPhone}>
              تحقق من رقم الجوال
            </Button>
          )}
          {phoneVerificationStep === 'sent' && (
            <>
              <div className="flex-1">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">رمز التحقق</label>
                  <Input
                    value={phoneCode}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhoneCode(e.target.value)}
                    placeholder="أدخل الرمز المرسل"
                  />
                </div>
              </div>
              <Button type="button" variant="primary" onClick={handleConfirmPhoneCode}>
                تأكيد
              </Button>
            </>
          )}
          {phoneVerificationStep === 'verified' && (
            <div className="flex items-center px-3 py-2 bg-green-100 text-green-700 rounded-lg">
              <span className="text-sm font-medium">✓ تم التحقق</span>
            </div>
          )}
        </div>
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>رقم الجوال الكامل:</strong> <span className="font-mono">{countryCode} {phone}</span>
          </p>
          <p className="text-xs text-blue-600 mt-1">
            تأكد من صحة رقم الجوال لتلقي رسائل التحقق والإشعارات
          </p>
          {phone && (
            <div className="mt-2 text-xs">
              <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded">
                الدولة: {COUNTRY_CODES.find(c => c.value === countryCode)?.country || 'غير محدد'}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-2">الدور في المنصة</label>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="role" value="user" checked={role === 'user'} onChange={() => setRole('user')} />
            مستخدم
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="role" value="supervisor" checked={role === 'supervisor'} onChange={() => setRole('supervisor')} />
            مشرف
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="role" value="worker" checked={role === 'worker'} onChange={() => setRole('worker')} />
            عامل/فني
          </label>
        </div>
      </div>
      {role === 'worker' && (
        <div>
          <label className="block mb-2 font-medium">التخصصات (اختر تخصصاتك لتصلك فرص العمل المناسبة)</label>
          <div className="grid grid-cols-2 gap-2">
            {TRADES.map(trade => (
              <label key={trade.value} className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={trades.includes(trade.value)}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setTrades(e.target.checked
                      ? [...trades, trade.value]
                      : trades.filter((t: string) => t !== trade.value));
                  }}
                />
                <span>{trade.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
      {role === 'supervisor' && (
        <div className="mb-4 text-blue-700 font-medium border p-3 rounded-lg bg-blue-50">
          ستظهر هنا طلبات الإشراف على المنازل (قريباً)
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">المنطقة</label>
          <select
            value={region}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              setRegion(e.target.value);
              setCity('');
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            dir="rtl"
            required
          >
            {REGIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">المدينة</label>
          <select
            value={city}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCity(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            dir="rtl"
            required
          >
            {(region && Object.prototype.hasOwnProperty.call(CITIES, region)
              ? CITIES[region as keyof typeof CITIES]
              : [{ value: '', label: 'اختر المدينة' }]
            ).map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">الحي (اختياري)</label>
          <Input
            value={neighborhood}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNeighborhood(e.target.value)}
            placeholder="اسم الحي"
          />
        </div>
      </div>
      <div>
        <label className="block mb-2 font-medium">الموقع الجغرافي</label>
        <div className="flex gap-2 items-center mb-2">
          <Button
            type="button"
            variant="primary"
            onClick={handleNationalAddress}
            loading={apiLoading}
          >
            {apiLoading ? 'جاري جلب الموقع...' : 'جلب الموقع من العنوان الوطني'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => window.open(`http://apina.address.gov.sa/NationalAddress/v3.1/maps/map-engine?subscription-key=${process.env.NEXT_PUBLIC_ADDRESS_API_KEY}`, '_blank')}
          >
            فتح خريطة العنوان الوطني
          </Button>
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={handleLocate}
        >
          حدد موقعي على الخريطة (GPS)
        </Button>
        {location && (
          <div className="mt-2 text-sm text-gray-700">
            الإحداثيات: {location.lat}, {location.lng}
          </div>
        )}
      </div>
      <Button
        type="submit"
        variant="primary"
        loading={saving}
        className="w-full"
      >
        {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
      </Button>
      {invitationCode && (
        <div className="mt-4 text-xs text-blue-700 bg-blue-50 rounded p-2 font-mono text-center">
          رمز الدعوة الخاص بك: <b>{invitationCode}</b>
        </div>
      )}
    </form>
  );
}




