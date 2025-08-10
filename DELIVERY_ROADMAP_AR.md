# المراحل التنفيذية المهمة (مختصر عملي)

> هدف الوثيقة: الوصول إلى 100% إنجاز عبر مراحل قصيرة واضحة، متوافقة مع بنية Next.js/TypeScript/DDD/Supabase/i18n/Tailwind الحالية.

## قائمة المهام المتبقية (مختصر) — محدّثة
- [x] إنشاء View آمن `products_with_store` والقراءة منه في `/api/products` مع fallback.
- [x] إضافة فلاتر `category`, `q`, `storeId`, `inStock` في `/api/products` وربطها بالواجهة.
- [x] تمكين StorePicker وربطه بالواجهة وإرجاع المتاجر المتاحة من نتائج API.
- [x] إصلاح حلقة إعادة التصيير في Hook السوق، وتثبيت setState.
- [x] توحيد عربة الشراء عبر `CartProvider` وحل خطأ useCart.
- [x] تعريب تسميات أساسية (البطاقة/السلة/الفلاتر) وإزالة المخزون المُثبت (50) من الشبكة.
- [x] شارة "شحن مجاني" في البطاقة عند توفرها من الـ API (بدون افتراضات).
- [ ] تطبيق عرض الشحن المجاني على مستوى قاعدة البيانات (مصدر `free_shipping_threshold`) أو حساب موثوق في الـ View.
- [ ] فلترة الضمان على الخادم (تحديد مصدر الحقيقة: حقل في `products` أو ربط جدول warranties).
- [x] لصق تدفق الدفع: إنشاء فاتورة بعد `guest-checkout` (نسخة تجريبية آمنة)؛ الضمان اختياري لاحقًا.
- [ ] تعميم i18n على الصفحات الأساسية وتوحيد النصوص.
- [ ] سياسات RLS شاملة لمنتجات/طلبات/عملاء + مراجعة RPC.
- [ ] متعدد العملات: تخزين تفضيل المستخدم/الضيف وتطبيق `formatCurrency` عبر الصفحات.
- [ ] تخصيص المتجر (store_themes) وربطه بواجهة العرض.
- [ ] QA شامل: لا زر مكسور/لا روابط خاطئة/دفق سوق→سلة→دفع→تتبّع يعمل.

## المرحلة 1: تنظيف وتوحيد البيانات (1–2 أسابيع)
- تشغيل `scripts/verify-supabase-integration.cjs` ومعالجة الملفات التي ما تزال تحتوي بيانات مضمَّنة.
- تشغيل `scripts/verify-supabase-integration.cjs` ومعالجة أول 30 ملفًا لإزالة أي بيانات مضمَّنة.
- مراجعة `next.config.js` و`tailwind.config.js` لتقليل التحميلات غير الضرورية.
- قاعدة البيانات (Supabase): تدقيق/إضافة الجداول الأساسية (profiles, organizations, org_verifications, projects, project_members, product_prices, warranties) + فهارس.
- RLS أولي: وصول قائم على المالك/العضوية/الانتماء للمؤسسة + Views مبسطة.

قبول المرحلة: بناء وLint بدون أخطاء حرجة، 0 بيانات dummy في الصفحات الأساسية، الخدمات الموحَّدة مستخدمة عبر المشروع.

## المرحلة 2: Storefront/Marketplace + شراء الضيف (2 أسابيع)
- تمكين القراءة/الكتابة الآمن لـ `customers/orders` عبر Supabase (مع RLS/RPC).
- ربط الطلبات داخل المشروع: تسجيل مصروف + ضمان + مرفقات تلقائيًا عند الشراء من داخل المشروع.
- Storefront للمتاجر: صفحة عامة قابلة للتخصيص (`store_themes`).

قبول المرحلة: شراء كضيف يعمل مع تتبّع، المنتجات تُعرض من Supabase، والطلبات تظهر في ERP والمشاريع عند الارتباط.
حالة التنفيذ: تم تفعيل `guest-checkout` عبر RPC؛ وتمت إضافة إنشاء فاتورة تجريبية بعد الإرجاع.

## المرحلة 3: i18n + الوضع الداكن + متعدد العملات (1–2 أسابيع)
- تعميم i18next على جميع الصفحات والمكوّنات وتوحيد مفاتيح النصوص.
- تمكين next-themes/آلية بديلة وربطها بـ `profiles.theme` مع حفظ تفضيلات المستخدم.
- اختيار العملات عند التسجيل وتخزينها في `profiles.currencies[]`.
- تسعير متعدد العملات عبر `product_prices` أو تحويل/عرض منسّق حسب جلسة المستخدم/الزائر.

قبول المرحلة: العربية/الإنجليزية + الوضع الداكن يعملان عبر الصفحات الأساسية، الأسعار والتنسيق صحيحان.

## المرحلة 4: ERP + تقارير + ذكاء اصطناعي + حاسبة الكميات (2–3 أسابيع)
- ربط `SupabaseERPSystem.tsx` ببيانات حية: عملاء/طلبات/فواتير/مخزون.
- تقارير أرباح/هامش/متأخرات + اختياري توليد ZATCA QR للفواتير.
- AI: توصيات أولية حسب المدينة/سلوك المستخدم (lib/ai كمدخل).
- حاسبة الكميات: نماذج المواد، حفظ التركيبات في Supabase، إضافة النتائج للسلة/طلب عرض سعر.

قبول المرحلة: لوحات ERP تعرض بيانات حية، الحاسبة تضيف نتائج للسلة/عرض سعر، توصيات ظاهرة في مواضع مختارة.

## المرحلة 5: قرار Medusa وتنظيف الإنتاج (1 أسبوع)
- حسم القرار: تكامل فعلي (SDK/REST) أو إزالة تدريجية والاعتماد على Supabase.
- إزالة جميع الـ mocks من الإنتاج، تنظيف الاعتمادات غير المستخدمة.
- توثيق نهائي + مراقبة + حدود طلبات (Rate Limits).

قبول المرحلة: لا mocks في الإنتاج، توثيق محدَّث، مراقبة أساسية فعّالة.

---

# خطة تفصيلية متوافقة مع الهيكل الحالي

## مواءمة سريعة مع المستودع
- الواجهات: `src/app`, `src/components`, `src/domains/*` (storefront, marketplace, erp, pos, ...).
- الخدمات/البيانات: `src/lib/supabase/*`, `src/services/*`, `types/supabase.ts`.
- السكربتات: `scripts/verify-supabase-integration.cjs`.
- الإعدادات: `next.config.js`, `tailwind.config.js`, `eslint.config.js`, `tsconfig.json`.
- قاعدة البيانات: `database/*.sql` (+ RLS/Views/RPC لاحقًا).

اعتماد تصميمي: توحيد مصدر الحقيقة لكل نطاق داخل `src/domains/<domain>` وطبقة خدمات مشتركة `src/services/supabaseDataService.ts`.

## تصنيف المستخدمين والأدوار
- المستفيدون: فرد/مطوّر عقاري/مشرف/عامل.
- مقدّمو الخدمات: مؤسسات/متاجر/شركات خدمات عامة.
- الزوّار: غير مسجلين (شراء كضيف + تتبّع الطلب).

الحفظ في `profiles` (مرتبطة بـ auth.users):
- role, languages, theme, currencies[], city, phone_verified.

## التسجيل والتحقق
- OTP بالجوال للمستفيدين.
- مقدّمو الخدمات: OTP + رقم سجل تجاري، تحقق حكومي (endpoint stub + حالة Pending/Verified/Rejected) ثم شارة ✅.

## الربط بين الأطراف
- إضافة مشرف/عامل للمشروع برقم الجوال: إذا موجود يُربط فورًا، وإلا دعوة تسجيل.
- المؤسسات تضيف موظفين بأرقام الجوال → الربط تلقائي عند التسجيل.
- الطلبات داخل المشروع تُسجّل كمصروف + ضمان + مرفقات.

## مسارات المشروع
1) إنشاء مشروع: موقع/نوع/مراحل/صورة/(للبيع؟ + ترخيص إعلاني).
2) شراء من Marketplace مدمج داخل المشروع.
3) تنفيذ ومتابعة: تحديث تقدم المراحل، إنقاص الكميات تلقائيًا عند الشراء.
4) تقرير ختامي: منتجات/ضمانات/فواتير/صور/تقدم.
5) عرض للبيع (اختياري): الظهور في قسم عام.

## طبقة API/BFF (مقترحة تحت app/api)
- auth: start-otp, verify-otp, profile(get/update), provider-verify (stub + webhooks).
- users: invite-by-phone, link-to-project, link-to-org.
- projects: CRUD, members, stages/progress, report, publish-for-sale.
- stores: CRUD, theme, media, catalog sync.
- products: list/filter/search, pricing-by-currency.
- cart|orders: guest-checkout, checkout, track(order_number|phone|email).
- erp: customers, invoices, payments, stock movements, kpis.
- ai: recommendations, quantity-calculator.

## نموذج بيانات مختصر (Supabase)
- profiles, organizations, org_verifications, org_members.
- stores, store_themes, media.
- products, product_prices (عملة)، stock, warranties.
- customers, orders, order_items, invoices, payments, shipments.
- projects, project_members, project_stages, project_progress, project_expenses, project_assets, project_sales.

RLS: حسب المالك/عضوية المشروع أو المؤسسة + JWT من Supabase + Views/RPC للعمليات المعقدة (مثال: `checkout_guest_with_project_log`).

## i18n + الوضع الداكن + العملات
- تعميم i18next، مفاتيح موحّدة، Provider على مستوى layout.
- next-themes أو آلية ثابتة مرتبطة بـ `profiles.theme`.
- اختيار/تخزين عملات المستخدم وعرض الأسعار بصيغة صحيحة.

## معايير القبول النهائية
- 0 بيانات مضمّنة في الإنتاج.
- شراء كضيف يصدر رقم طلب وتتبّع يعمل.
- i18n للعربية/الإنجليزية + الوضع الداكن على الصفحات الأساسية.
- متعدد العملات فعّال بصريًا ومنطقيًا.
- ERP بلوحات بيانات حية دون أخطاء حرجة.
- اختبارات قبول لمسارات: تسجيل/إنشاء متجر/تصفح-شراء-تتبّع/إنشاء فاتورة.

## خطة اختبار سريعة
- وحدات: خدمات Supabase، تحويل/تنسيق العملات، RPCs الحساسة.
- تكامل: guest checkout، إدخال طلب مرتبط بمشروع.
- E2E: تدفقات عربية/إنجليزية + الوضع الداكن.

## خطوات فورية (Next Actions)
- [x] تعريب العناصر الظاهرة في السوق (الفلاتر/السلة/الأزرار) وإزالة أي قيم ثابتة مضللة (مثل المخزون 50/تقييم 4.5/ضمان سنة افتراضي).
- [x] إلغاء تمرير ضمان افتراضي من `ProductGrid` وترك العرض مشروطًا ببيانات حقيقية.
- [ ] تثبيت مصدر قيمة الشحن المجاني: إضافة `free_shipping_threshold` في `public.stores` أو مسار بديل، ثم إعادة تمكين حسابه في الـ View.
- [x] إضافة اختبار صغير للتحقق من بناء بارامترات `/api/products` بما فيها `inStock` و`storeId` و`freeShipping`.
- [x] وصل `guest-checkout` بإنشاء `public.invoices` (نسخة تجريبية بعد نجاح RPC مع RLS آمنة قدر الإمكان).
## ملاحظات تقدم موجزة (تعقب فقط لما تبقّى)
	- `products.barcode` ↔ `store_products.sku`
	- `stores.user_id` ↔ `store_products.user_id`
	وتعيد `store_id, store_name, store_city` عند توفر الربط.
 تم: تحديث `/api/products` لتفضيل القراءة من الـ View الجديدة مع فلاتر `category` و`q` (تبحث في name/name_ar/barcode) مع رجوع تلقائي لجدول `products` عند غياب الـ View.
 تم: إضافة فلترة `storeId` في `/api/products` (شرط eq على `store_id` ضمن الـ View) مع fallback سليم — 9 أغسطس 2025.
 تم: ربط فِلتر `storeId` بواجهة المستخدم عبر مكوّن StorePicker في `MarketplaceView`؛ يشتقّ قائمة المتاجر من نتائج `/api/products` ويعرض "All stores" عند غياب الربط — 9 أغسطس 2025.
 ملاحظات تحقق: 
  - بناء الإنتاج PASS بعد إزالة تعارض المسارات (privacy/terms) بين الجذر ومجموعة `(public)`.
  - `ProductGrid` يعرض `storeName/storeId` عند توافر الربط عبر الـ View.
  - التصفية تعمل عبر `/api/products?storeId=...` وتعود 0–n عناصر بلا أخطاء.
	- `npm run db:seed:users-store` لإنشاء مستخدمين عبر Supabase Admin API:
		- user@binaa.com — كلمة المرور: "demo 123"
		- store@binaa.com — كلمة المرور: "demo123"
		وإنشاء متجر للمستخدم الثاني وربط المنتجات به عبر `store_products`.
- تبقى: ربط الطلبات بالمشاريع (توسيع التسجيل والمرفقات)، وتخصيص المتجر.

	- التحقق من جميع أزرار الصفحة الرئيسية وتعديل الروابط الخاطئة.
	- تشغيل تدفق سوق → عربة → دفع كضيف → تتبع (نجاح/أخطاء) وتوثيق النتائج.
	- ربط أي مسارات ناقصة بصفحات موجودة أو TODOs واضحة.

 حالة التنفيذ (Delta):
- تم: إنشاء وتوحيد مسارات روابط الهبوط تحت `(public)/` (services, suppliers, projects, help, contact, terms, privacy) وحل تعارضات المسارات الموازية مع جذور `/marketplace` و`/projects`.
- تم: توحيد `/marketplace` على صفحة `(public)/marketplace` وإزالة/تحييد الجذر المتعارض.
- تم: إصلاح بقايا خطأ TypeScript في start-otp بإزالة `data.channel`.
- تم: تفعيل `/api/products` لقراءة من `products_with_store` أولًا مع فلاتر سليمة، مع fallback إلى `products` لضمان الاستقرار.
- تم: ظهور حقول المتجر (storeId/storeName/city) عند توفر ربط عبر `store_products` و`stores`.
- متبقي: إضافة فلترة حسب `storeId` عند الحاجة، وتحسين استخراج المدينة من `stores.location` (jsonb) بدل `address` عند توحيد البنية.

---

## أدوات قاعدة البيانات وإدارة المخطط/البيانات
- فحص المخطط: `npm run db:introspect`
	- يقرأ الاتصال من `.env(.local)` ويولّد: `docs/schema/SCHEMA_OVERVIEW.md`, `docs/schema/introspection.json`, `docs/schema/ERD.mmd`.
- تطبيق SQL عام: `npm run db:apply:sql -- <path-to-sql>`
	- مثال: `npm run db:apply:view` لتطبيق `database/migrations/20250809_products_with_store_view.sql`.
- تهيئة بيانات سريعة:
	- منتجات فقط: `npm run db:seed:demo` (يولّد رموز barcode عشوائية وكميات وستظهر الأسعار والمخزون في الواجهة).
	- مستخدمون + متجر + ربط منتجات: `npm run db:seed:users-store`
		- ينشئ المستخدمين: `user@binaa.com / "demo 123"` و `store@binaa.com / "demo123"`،
			ينشئ متجرًا للمستخدم الثاني ويربط منتجات حديثة عبر `store_products` (sku=barcode).

ملاحظات:
- تتطلب سكربتات المستخدم/المتجر توفر `NEXT_PUBLIC_SUPABASE_URL` و`SUPABASE_SERVICE_ROLE_KEY`، وأن يكون `DATABASE_URL` مهيأ لاتصال Postgres مباشر.
- يمكن تحسين عرض المدينة لاحقًا بقراءة `stores.location` (jsonb) إن توحدت بنيته.

## خطوات فورية (Next Actions) — محدثة
- جديد: تنفيذ فلتر `storeId` في `/api/products` وربطه بالواجهة:
	- Backend: قبول `storeId` في `products_with_store` (شرط `eq(store_id, ...)`)، ومعالجة fallback.
	- Frontend: إضافة عنصر اختيار المتجر (store picker) وتمرير المعلَمة إلى API.
	- قبول: تصفية النتائج حسب المتجر محددًا؛ إرجاع 0–n عناصر بدون أخطاء.
- جديد: سكربت تهيئة مصغر لأمر + تتبّع (Minimal Order + Tracking Seeder):
	- إنشاء عميل بسيط (customer) إن لزم.
	- استخدام RPC `checkout_guest_with_project_log` لإنشاء طلب تجريبي وإرجاع `order_number`.
	- طباعة `order_number` ثم التحقق عبر RPC `get_order_tracking` وإظهار الحالة.
	- إضافة هدف npm: `npm run db:seed:order-track`.
	- قبول: يظهر `order_number` ويتم جلب تتبّعه بنجاح (200) مع حالة صالحة.
- فحص/تحسين سياسات RLS لمنتجات/طلبيات/عملاء والتأكد من تغطية الـ RPC الحساسة.
- تعميم i18n/Theme وربطهما بـ profiles، وإكمال متعدد العملات.

## المهام غير المكتملة (Snapshot)
- ربط الطلبات بالمشاريع بشكل موسّع (مصروف/ضمان/مرفقات تلقائيًا) — Pending.
- تخصيص المتجر (store_themes) وربطه بالواجهة — Pending.
- تعميم i18n على الصفحات الأساسية + Theme مرتبط بـ profiles.theme — Pending.
- متعدد العملات: تخزين تفضيلات المستخدم وتطبيق `formatCurrency` شامل — Pending.
- سياسات RLS الشاملة على المنتجات/الطلبات/العملاء + مراجعة الصلاحيات — Pending.
- تحسين استخراج المدينة من `stores.location` (jsonb) في الـ View — Pending.
- سكربت مصغر لأمر + تتبع (Order + Tracking Seeder) — Pending (أُضيف كـ Next Action).
- QA شامل بعد تطبيق الـ View في جميع البيئات (Dev/Prod) — Pending.
- معايير القبول: لا زر مكسور، لا رابط خاطئ، كل التدفقات الحرجة تعمل من الواجهة حتى قاعدة البيانات.
