# Admin API Guide

## Umumiy Ko'rinish

Admin page uchun alohida API functions yaratildi. Barcha admin sahifalar endi `lib/adminApi.ts` orqali ishlaydi.

## API Functions

### Dashboard API

```typescript
import { getDashboardStats } from "@/lib/adminApi";

// Dashboard stats va recent matches olish
const { stats, recentMatches } = await getDashboardStats();
```

### Fields API

```typescript
import { getFields, createField, deleteField } from "@/lib/adminApi";

// Barcha fields olish
const fields = await getFields();

// Yangi field yaratish
const newField = await createField({
  name: "Field Name",
  location: "Seoul",
  size: "40x20m",
  indoorOutdoor: "Outdoor",
  price: 55000,
  status: "active"
});

// Field o'chirish
await deleteField(fieldId);
```

### Matches API

```typescript
import { getMatches, createMatch, deleteMatch } from "@/lib/adminApi";

// Barcha matches olish
const matches = await getMatches();

// Yangi match yaratish
const newMatch = await createMatch({
  fieldId: "field-id",
  field: "Field Name",
  date: "2026-01-30",
  time: "20:00",
  maxParticipants: 12,
  gender: "all",
  level: "all",
  description: "Optional description"
});

// Match o'chirish
await deleteMatch(matchId);
```

### Users API

```typescript
import { getUsers, updateUserRole, toggleUserBlock } from "@/lib/adminApi";

// Barcha users olish
const users = await getUsers();

// User role o'zgartirish
const updatedUser = await updateUserRole(userId, "admin");

// User block/unblock
const updatedUser = await toggleUserBlock(userId);
```

## Backend Support

API functions avtomatik ravishda quyidagi backend'larni qo'llab-quvvatlaydi:

1. **GraphQL Backend** - Agar `NEXT_PUBLIC_GRAPHQL_URL` bo'lsa
2. **REST API Backend** - Agar `NEXT_PUBLIC_API_BASE_URL` bo'lsa
3. **Mock Data** - Agar backend bo'lmasa

## Foydalanish

### Dashboard

```typescript
// pages/admin/dashboard.tsx
import { getDashboardStats } from "@/lib/adminApi";

const loadDashboardData = async () => {
  const { stats, recentMatches } = await getDashboardStats();
  setStats(stats);
  setRecentMatches(recentMatches);
};
```

### Fields Management

```typescript
// pages/admin/fields/index.tsx
import { getFields, deleteField } from "@/lib/adminApi";

const loadFields = async () => {
  const fields = await getFields();
  setFields(fields);
};

const handleDelete = async (id: string) => {
  await deleteField(id);
  setFields(fields.filter(f => f.id !== id));
};
```

### Matches Management

```typescript
// pages/admin/matches/index.tsx
import { getMatches, deleteMatch } from "@/lib/adminApi";

const loadMatches = async () => {
  const matches = await getMatches();
  setMatches(matches);
};
```

### Users Management

```typescript
// pages/admin/users/index.tsx
import { getUsers, updateUserRole, toggleUserBlock } from "@/lib/adminApi";

const loadUsers = async () => {
  const users = await getUsers();
  setUsers(users);
};

const handleUpdateRole = async (userId: string, role: string) => {
  await updateUserRole(userId, role);
  // Update UI
};
```

## Error Handling

Barcha API functions error handling bilan ishlaydi:

```typescript
try {
  const data = await getFields();
  setFields(data);
} catch (error: any) {
  console.error("Error:", error);
  setError(error?.message || "Failed to load fields");
  // Fallback to mock data
  setFields(getMockFields());
}
```

## Mock Data Fallback

Agar backend bo'lmasa yoki xatolik bo'lsa, avtomatik ravishda mock data ishlatiladi. Bu development va testing uchun qulay.

## Xususiyatlar

- ✅ GraphQL va REST backend support
- ✅ Automatic error handling
- ✅ Mock data fallback
- ✅ Type-safe (TypeScript)
- ✅ Simple va clean API
- ✅ Consistent interface

## Qo'shimcha Ma'lumot

Batafsil ma'lumot: `lib/adminApi.ts` faylida.

