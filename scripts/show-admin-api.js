#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('\n╔══════════════════════════════════════════════════════════════╗');
console.log('║           ADMIN PAGE API ENDPOINTS                          ║');
console.log('╚══════════════════════════════════════════════════════════════╝\n');

console.log('📋 Admin API Functions (lib/adminApi.ts):\n');

const apiFunctions = [
  { name: 'getDashboardStats()', desc: 'Dashboard stats va recent matches' },
  { name: 'getFields()', desc: 'Barcha fields olish' },
  { name: 'createField(field)', desc: 'Yangi field yaratish' },
  { name: 'deleteField(id)', desc: 'Field o\'chirish' },
  { name: 'getMatches()', desc: 'Barcha matches olish' },
  { name: 'createMatch(match)', desc: 'Yangi match yaratish' },
  { name: 'deleteMatch(id)', desc: 'Match o\'chirish' },
  { name: 'getUsers()', desc: 'Barcha users olish' },
  { name: 'updateUserRole(id, role)', desc: 'User role o\'zgartirish' },
  { name: 'toggleUserBlock(id)', desc: 'User block/unblock' },
];

apiFunctions.forEach((func, index) => {
  console.log(`  ${index + 1}. ${func.name}`);
  console.log(`     → ${func.desc}\n`);
});

console.log('🔗 GraphQL Endpoints:\n');
console.log('  • NEXT_PUBLIC_GRAPHQL_URL bo\'lsa:\n');
console.log('    - query DashboardStats');
console.log('    - query Fields');
console.log('    - mutation CreateField');
console.log('    - mutation DeleteField');
console.log('    - query Matches');
console.log('    - mutation CreateMatch');
console.log('    - mutation DeleteMatch');
console.log('    - query Users');
console.log('    - mutation UpdateUser');
console.log('    - mutation BlockUser\n');

console.log('🔗 REST API Endpoints:\n');
console.log('  • NEXT_PUBLIC_API_BASE_URL bo\'lsa:\n');
console.log('    - GET    /admin/dashboard');
console.log('    - GET    /admin/fields');
console.log('    - POST   /admin/fields');
console.log('    - DELETE /admin/fields/:id');
console.log('    - GET    /admin/matches');
console.log('    - POST   /admin/matches');
console.log('    - DELETE /admin/matches/:id');
console.log('    - GET    /admin/users');
console.log('    - PATCH  /admin/users/:id/role');
console.log('    - PATCH  /admin/users/:id/block\n');

console.log('📚 Documentation:\n');
console.log('  • ADMIN_API_GUIDE.md - API qo\'llanmasi');
console.log('  • ADMIN_API_ENDPOINTS.md - Barcha endpoints');
console.log('  • ADMIN_GUIDE.md - Admin page qo\'llanmasi\n');

console.log('🌐 Admin Pages:\n');
console.log('  • http://localhost:3000/admin/dashboard');
console.log('  • http://localhost:3000/admin/fields');
console.log('  • http://localhost:3000/admin/matches');
console.log('  • http://localhost:3000/admin/users\n');

console.log('💡 Tip: Admin bo\'lish uchun email\'da "admin" so\'zi bo\'lishi kerak\n');

