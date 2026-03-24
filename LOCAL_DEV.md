# Lokal ishlab chiqish — tekshiruv ro‘yxati

## 1. MongoDB (kickup)

- `kickup/.env` faylida **`MONGO_DEV`** (dev) yoki **`MONGO_PROD`** (prod) to‘liq URI bo‘lishi kerak.
- Noto‘g‘ri URI → API `mongoose` bilan uzoq "osilib" qolishi yoki GraphQL **timeout** berishi mumkin.
- Atlas: IP whitelist / `0.0.0.0/0` (vaqtincha test) ni tekshiring.

## 2. Backend (kickup-api)

```bash
cd kickup
docker compose up -d
# yoki: npm run start:dev
```

- Brauzer: `http://localhost:4002/graphql` — Playground ochilishi kerak.
- Konteyner ichida port **3008**, tashqarida **4002** (`docker-compose.yml`).

## 3. Frontend (kickup-next)

**Variant A — bitta Compose (tavsiya, Docker ichida Next):**

```bash
cd kickup-next
docker compose -f docker-compose.fullstack.yml up -d --build
```

- Next: `http://localhost:4000`
- Proxy: `GRAPHQL_PROXY_TARGET=http://kickup-api:3008/graphql` (bir tarmoq)

**Variant B — Next Docker, API alohida (host 4002):**

```bash
# Avval kickup ishga tushgan bo‘lsin
cd kickup-next
docker compose up -d
```

- `.env` / `docker-compose`: `GRAPHQL_PROXY_TARGET=http://host.docker.internal:4002/graphql`

**Variant C — Next hostda (eng oson debug):**

```bash
cd kickup-next
# .env.local: GRAPHQL_PROXY_TARGET=http://127.0.0.1:4002/graphql
yarn dev
```

## 4. Login / Register

- GraphQL: `login`, `register`, `adminExists` — `kickup-api` ishlamasa ishlamaydi.
- Token: `localStorage.token`, so‘rovlar: `Authorization: Bearer ...`

## 5. Tez test

```bash
curl -s -X POST http://localhost:4002/graphql -H "Content-Type: application/json" -d "{\"query\":\"query { adminExists }\"}"
```

Javobda `data` bo‘lsa — API va DB ishlayapti.
