This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

**Note:** Terminal'da `npm run dev` yoki `yarn dev` ishga tushganda, admin page API endpoints avtomatik ko'rsatiladi.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Admin Page API

Terminal'da `npm run dev` yoki `yarn dev` ishga tushganda, admin page API endpoints avtomatik ko'rsatiladi.

Barcha admin API functions `lib/adminApi.ts` da:

- `getDashboardStats()` - Dashboard stats va recent matches
- `getFields()`, `createField()`, `deleteField()` - Fields management
- `getMatches()`, `createMatch()`, `deleteMatch()` - Matches management
- `getUsers()`, `updateUserRole()`, `toggleUserBlock()` - Users management

**Admin API Documentation:**
- `ADMIN_API_GUIDE.md` - API qo'llanmasi
- `ADMIN_API_ENDPOINTS.md` - Barcha endpoints (GraphQL va REST)
- `ADMIN_GUIDE.md` - Admin page qo'llanmasi

**Admin Pages:**
- http://localhost:3000/admin/dashboard
- http://localhost:3000/admin/fields
- http://localhost:3000/admin/matches
- http://localhost:3000/admin/users

**Admin bo'lish:** Email'da "admin" so'zi bo'lishi kerak (masalan: `admin@test.com`)

## Connecting Frontend to Backend

This app is a Next.js frontend. You can connect it to a separate backend server (recommended for real auth/admin data).

### Quick (Uzbek) — Backend’ga ulash

1) Project root’ga `.env.local` yarating:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:3008/graphql
```

2) `npm run dev` ni qayta ishga tushiring (env o‘zgarsa restart kerak).

3) Backend CORS’ni yoqing (agar frontend `http://localhost:3000`, backend esa `http://localhost:4000` bo‘lsa):
- `Access-Control-Allow-Origin: http://localhost:3000`
- `Access-Control-Allow-Headers: Content-Type, Authorization`
- `Access-Control-Allow-Methods: GET,POST,PUT,PATCH,DELETE,OPTIONS`

4) Endi frontend ichida so‘rovlar `lib/apiClient.ts` orqali backend’ga ketadi.

GraphQL ishlatsangiz `lib/graphqlClient.ts` dagi `graphqlRequest()` dan foydalaning.

### 1) Create `.env.local`

In the project root, create a file named `.env.local`:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:3008/graphql
```

- `NEXT_PUBLIC_API_BASE_URL` should point to your backend base URL (no trailing slash).
- Restart `npm run dev` after changing env vars.

### 2) Backend endpoints expected (current frontend)

The current auth flow in `contexts/AuthContext.tsx` expects:

- `POST /auth/login` with JSON `{ "email": "...", "password": "..." }`
  - returns JSON `{ "user": { ... }, "token": "..." }`
- `POST /auth/register` with JSON `{ "email": "...", "password": "...", "name": "..." }`
  - returns JSON `{ "user": { ... }, "token": "..." }`

The token is stored in `localStorage` as `token` and sent as `Authorization: Bearer <token>` when you call `apiRequest(..., { auth: true })`.

### 3) Calling backend from pages/components

Use the shared helper:

- `lib/apiClient.ts` → `apiRequest<T>(path, options)`
- `lib/graphqlClient.ts` → `graphqlRequest<TData>(query, { variables, auth })`

Example:

```ts
import { apiRequest } from \"@/lib/apiClient\";

const fields = await apiRequest<Field[]>(\"/admin/fields\", { auth: true });
```

GraphQL example:

```ts
import { graphqlRequest } from \"@/lib/graphqlClient\";

type MeQuery = { me: { id: string; email: string; name: string } };

const data = await graphqlRequest<MeQuery>(`
  query Me {
    me { id email name }
  }
`, { auth: true });
```

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.
