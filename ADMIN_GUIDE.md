# Admin Page - Qo'llanma

## Admin Page'ga Kirish

### 1. Login Qilish

1. `/login` sahifasiga o'ting
2. Admin email bilan kirish:
   - **Mock mode (backend bo'lmasa)**: Email'da "admin" so'zi bo'lishi kerak
     - Masalan: `admin@example.com`, `testadmin@gmail.com`
   - **Backend mode**: Backend'dan `role: 'admin'` kelishi kerak
3. Login'dan keyin avtomatik `/admin/dashboard` ga o'tadi

### 2. To'g'ridan-to'g'ri Kirish

- URL: `http://localhost:3000/admin/dashboard`
- Yoki header'dagi "Admin" button'ini bosing (admin bo'lsa ko'rinadi)

## Admin Dashboard

### Asosiy Funksiyalar

1. **Stats Cards**
   - Total Matches: Barcha match'lar soni
   - Active Fields: Faol field'lar soni
   - Total Users: Barcha user'lar soni
   - Revenue: Jami daromad

2. **Recent Matches**
   - So'nggi match'lar ro'yxati
   - "View All" button bilan barcha match'larni ko'rish

3. **Quick Actions**
   - Create New Match: Yangi match yaratish
   - Manage Fields: Field'larni boshqarish
   - Manage Users: User'larni boshqarish

4. **Analytics**
   - Oylik o'sish ko'rsatkichlari
   - Faol booking'lar soni

## Fields Management (`/admin/fields`)

### Funksiyalar

1. **Fields Ro'yxati**
   - Barcha field'lar jadval ko'rinishida
   - Search: Field nomi yoki location bo'yicha qidirish

2. **Field Yaratish**
   - "Add Field" button'ini bosing
   - Form to'ldiring:
     - Field Name
     - Location
     - Size (masalan: 40x20m)
     - Type (Indoor/Outdoor)
     - Price per Hour
     - Description (optional)

3. **Field Tahrirlash**
   - Table'dagi Edit icon'ni bosing
   - Form'ni to'ldiring va saqlang

4. **Field O'chirish**
   - Table'dagi Delete icon'ni bosing
   - Confirmation dialog'da "Delete" ni bosing

## Matches Management (`/admin/matches`)

### Funksiyalar

1. **Matches Ro'yxati**
   - Barcha match'lar jadval ko'rinishida
   - Search: Field nomi yoki date bo'yicha qidirish
   - Status Filter: All, Active, Pending, Completed, Cancelled

2. **Match Yaratish**
   - "Create Match" button'ini bosing
   - Form to'ldiring:
     - Field (dropdown'dan tanlang)
     - Date
     - Time
     - Max Participants
     - Gender (All Genders, Male, Female, Mixed)
     - Level (All Levels, Beginner, Intermediate, Advanced)
     - Description (optional)

3. **Match Ko'rish**
   - Table'dagi View icon'ni bosing
   - Match detaylarini ko'ring

4. **Match Tahrirlash**
   - Table'dagi Edit icon'ni bosing
   - Form'ni to'ldiring va saqlang

5. **Match O'chirish**
   - Table'dagi Delete icon'ni bosing
   - Confirmation dialog'da "Delete" ni bosing

## Users Management (`/admin/users`)

### Funksiyalar

1. **Users Ro'yxati**
   - Barcha user'lar jadval ko'rinishida
   - Search: Name yoki email bo'yicha qidirish
   - Role Filter: All Roles, User, Field Admin, Match Admin, Admin

2. **User Role O'zgartirish**
   - Table'dagi Edit icon'ni bosing
   - Dialog'da yangi role tanlang:
     - User
     - Field Admin
     - Match Admin
     - Admin
   - "Save" ni bosing

3. **User Block/Unblock**
   - Table'dagi Block/Unblock icon'ni bosing
   - Confirmation dialog'da "Block" yoki "Unblock" ni bosing

## Real Backend Integration

### GraphQL Backend

Agar `.env.local` da `NEXT_PUBLIC_GRAPHQL_URL` bo'lsa:

1. **Dashboard Stats**
   ```graphql
   query DashboardStats {
     dashboardStats {
       totalMatches
       activeFields
       totalUsers
       revenue
       matchesChange
       fieldsChange
       usersChange
       revenueChange
     }
   }
   ```

2. **Fields CRUD**
   - Create: `mutation CreateField(...)`
   - Read: `query Fields`
   - Update: `mutation UpdateField(...)`
   - Delete: `mutation DeleteField(...)`

3. **Matches CRUD**
   - Create: `mutation CreateMatch(...)`
   - Read: `query Matches`
   - Update: `mutation UpdateMatch(...)`
   - Delete: `mutation DeleteMatch(...)`

4. **Users Management**
   - Read: `query Users`
   - Update Role: `mutation UpdateUser(...)`
   - Block/Unblock: `mutation BlockUser(...)`

### Mock Mode (Backend bo'lmasa)

- Barcha data localStorage'da saqlanadi
- CRUD operations frontend'da ishlaydi
- Real backend bo'lganda GraphQL queries ishlatiladi

## Xavfsizlik

- Admin page'lar faqat `role: 'admin'` bo'lgan user'lar uchun ochiq
- Agar admin bo'lmasangiz, `/` ga redirect qilinadi
- Barcha GraphQL queries `auth: true` bilan yuboriladi (token bilan)

## Foydali Linklar

- Dashboard: `/admin/dashboard`
- Fields: `/admin/fields`
- Matches: `/admin/matches`
- Users: `/admin/users`
- Create Match: `/admin/matches/create`
- Create Field: `/admin/fields/create`

