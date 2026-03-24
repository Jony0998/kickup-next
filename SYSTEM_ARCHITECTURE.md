# Plabfootball.com Tizim Arxitekturasi

## Umumiy Ko'rinish

Plabfootball.com tizimi **Next.js** asosida qurilgan modern web platforma bo'lib, quyidagi asosiy komponentlardan iborat:

## 1. Frontend Arxitektura

### Technology Stack
- **Framework**: Next.js 16 (Pages Router)
- **UI Library**: Material-UI (MUI) v5
- **Styling**: SCSS Modules + CSS-in-JS (MUI)
- **State Management**: React Context API
- **GraphQL Client**: Apollo Client v4
- **TypeScript**: Type safety uchun

### Asosiy Komponentlar

```
kickup-next/
├── pages/              # Next.js Pages Router
│   ├── index.tsx       # Home page
│   ├── login.tsx       # Login page
│   ├── register.tsx    # Register page
│   ├── calendar.tsx    # Calendar page
│   ├── admin/          # Admin pages
│   ├── mypage/         # User pages
│   └── team/           # Team pages
├── components/         # Reusable components
│   ├── Layout.tsx      # Main layout
│   └── Footer.tsx      # Footer
├── contexts/           # React Context providers
│   ├── AuthContext.tsx # Authentication
│   └── ThemeContext.tsx # Theme management
├── lib/                # Utility functions
│   ├── apiClient.ts    # REST API client
│   ├── graphqlClient.ts # GraphQL client
│   └── apolloClient.ts # Apollo Client setup
└── styles/             # SCSS styles
```

## 2. Backend Integration

### Ikki xil Backend Support

#### A) REST API Backend
```typescript
// lib/apiClient.ts
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000

// Usage
await apiRequest('/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email, password }),
  auth: true // Adds Bearer token
});
```

#### B) GraphQL Backend
```typescript
// lib/graphqlClient.ts
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:3008/graphql

// Usage
await graphqlRequest(`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user { id name email role }
      token
    }
  }
`, {
  variables: { email, password },
  auth: true
});
```

### Apollo Client Integration
```typescript
// lib/apolloClient.ts
- Apollo Client v4 setup
- InMemoryCache for caching
- HttpLink with credentials support
- Automatic token management
```

## 3. Authentication System

### Auth Flow

1. **Login Process**:
   ```
   User enters email/password
   → AuthContext.login()
   → Backend API call (REST or GraphQL)
   → Store token in localStorage
   → Store user data in localStorage
   → Redirect based on role (admin → /admin/dashboard, user → /mypage)
   ```

2. **Role-Based Access**:
   - `user`: Regular user
   - `admin`: Full admin access
   - `field_admin`: Field management only
   - `match_admin`: Match management only

3. **Token Management**:
   - Token stored in `localStorage` as `token`
   - Sent as `Authorization: Bearer <token>` header
   - Automatic token injection in `apiRequest` and `graphqlRequest`

### Mock Mode (No Backend)
```typescript
// If no backend configured, uses mock authentication
// Email contains "admin" → role: "admin"
// Email contains "field" → role: "field_admin"
// Email contains "match" → role: "match_admin"
// Otherwise → role: "user"
```

## 4. Page Structure

### Public Pages
- `/` - Home page
- `/login` - Login page
- `/register` - Register page
- `/calendar` - Calendar view
- `/search` - Search matches
- `/rental` - Field rental

### Protected Pages (Requires Auth)
- `/mypage` - User dashboard
  - `/mypage/application-history` - Match applications
  - `/mypage/usage-history` - Usage history
  - `/mypage/coupons` - Coupons
  - `/mypage/challenges` - Challenges
  - `/mypage/friends` - Friends list
  - `/mypage/liked-matches` - Liked matches
  - `/mypage/ai-reports` - AI reports
  - `/mypage/friend-matches` - Friend matches
  - `/mypage/vacancy-notifications` - Notifications
  - `/mypage/invite-friends` - Invite friends
  - `/mypage/edit-profile` - Edit profile
  - `/mypage/settings` - Settings

### Admin Pages (Requires Admin Role)
- `/admin/dashboard` - Admin dashboard
- `/admin/fields` - Manage fields
  - `/admin/fields/create` - Create field
- `/admin/matches` - Manage matches
  - `/admin/matches/create` - Create match
- `/admin/users` - Manage users

## 5. Data Flow

### Component Hierarchy
```
_app.tsx
├── ApolloProvider (GraphQL client)
├── ThemeProvider (Theme context)
└── AuthProvider (Auth context)
    └── Layout (Main layout)
        └── Page Components
```

### State Management
- **Global State**: React Context API
  - `AuthContext`: User authentication state
  - `ThemeContext`: Theme (light/dark) state
- **Local State**: React useState/useReducer
- **Server State**: Apollo Client cache (GraphQL)

## 6. API Communication

### REST API Pattern
```typescript
// lib/apiClient.ts
export async function apiRequest<T>(
  path: string,
  options: RequestInit & { auth?: boolean } = {}
): Promise<T>

// Features:
- Automatic base URL from NEXT_PUBLIC_API_BASE_URL
- Automatic token injection if auth: true
- Error handling
- JSON parsing
```

### GraphQL Pattern
```typescript
// lib/graphqlClient.ts
export async function graphqlRequest<TData>(
  query: string,
  options: GraphQLRequestOptions = {}
): Promise<TData>

// Features:
- Automatic GraphQL URL from NEXT_PUBLIC_GRAPHQL_URL
- Automatic token injection if auth: true
- Error handling
- Type-safe responses
```

## 7. Styling System

### SCSS Modules
```scss
// styles/home.module.scss
.calendarDates { ... }
.dateItem { ... }
.filters { ... }
```

### Material-UI Theme
```typescript
// contexts/ThemeContext.tsx
- Light/Dark mode support
- MUI theme customization
- Consistent color scheme
```

### Inline Styles
- MUI `sx` prop for component-level styles
- Gradient backgrounds
- Responsive design

## 8. Key Features

### 1. Calendar System
- Date navigation
- Match filtering by date
- Recommended matches display
- Match count per date

### 2. Match Management
- Create matches (admin)
- View matches
- Apply to matches (users)
- Filter by status, gender, level

### 3. Field Management
- Field CRUD operations (admin)
- Field search
- Field status management

### 4. User Management
- User role management (admin)
- User block/unblock
- User search and filtering

### 5. My Page Features
- Application history
- Usage history
- Coupons management
- Friends management
- Profile editing
- Settings

## 9. Security Features

### Authentication
- Token-based authentication
- Role-based access control (RBAC)
- Protected routes
- Automatic redirect for unauthorized access

### Data Protection
- Token stored in localStorage
- Secure token transmission (Bearer token)
- CORS support for backend communication

## 10. Environment Configuration

### .env.local
```bash
# REST API Backend
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000

# GraphQL Backend
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:3008/graphql
```

### Fallback Behavior
- If no backend configured → Mock mode
- Mock data for development
- LocalStorage for persistence

## 11. Deployment

### Build Process
```bash
npm run build  # Production build
npm run start  # Production server
npm run dev    # Development server
```

### Production Considerations
- Environment variables
- API endpoint configuration
- CORS settings
- Token security
- Error handling

## 12. Plabfootball.com Specific Features

### Similar to Plabfootball.com:
1. **Calendar View**: Grid-style calendar with match recommendations
2. **My Page**: Sidebar navigation with multiple sub-pages
3. **Admin Dashboard**: Stats cards, recent matches, quick actions
4. **Match Management**: Create, edit, delete matches
5. **Field Management**: CRUD operations for fields
6. **User Management**: Role management, block/unblock
7. **Design**: Gradient backgrounds, modern UI, responsive design

## 13. Data Flow Example

### Creating a Match (Admin)
```
1. User clicks "Create Match"
2. Navigate to /admin/matches/create
3. Fill form (field, date, time, participants, etc.)
4. Submit form
5. graphqlRequest('mutation CreateMatch...')
6. Backend processes request
7. Success response
8. Redirect to /admin/matches
9. Updated match list displayed
```

### User Login Flow
```
1. User enters email/password
2. AuthContext.login() called
3. Check for backend (GraphQL or REST)
4. If backend: API call with credentials
5. If no backend: Mock authentication
6. Store token and user data
7. Redirect based on role
8. Update UI (show admin button, etc.)
```

## 14. Best Practices

### Code Organization
- Pages in `pages/` directory
- Reusable components in `components/`
- Context providers in `contexts/`
- Utility functions in `lib/`
- Styles in `styles/`

### Type Safety
- TypeScript for all files
- Type definitions for API responses
- Interface definitions for data models

### Error Handling
- Try-catch blocks
- Error messages to users
- Console logging for debugging
- Fallback to mock data

### Performance
- Apollo Client caching
- Lazy loading where possible
- Optimized images
- Code splitting (Next.js automatic)

## Xulosa

Plabfootball.com tizimi:
- **Modern**: Next.js, React, TypeScript
- **Flexible**: REST va GraphQL support
- **Scalable**: Modular architecture
- **Secure**: Token-based auth, RBAC
- **User-friendly**: Modern UI, responsive design
- **Maintainable**: Clean code structure, type safety

Bu arxitektura real production environment'da ishlash uchun tayyor va kengaytirish oson.

