# PC Hub — ระบบขายอุปกรณ์คอมพิวเตอร์ออนไลน์

Full-stack e-commerce web application built with **React 19 + Vite**, **Tailwind CSS**,
**Framer Motion**, **Zustand**, **React Hook Form + Zod**, **Recharts**, and **Supabase**
(Postgres + Auth + Storage).

## 1. Tech Stack

| Layer | Choice |
|---|---|
| Frontend | React 19 + Vite |
| Styling | Tailwind CSS (custom dark gaming theme) |
| Animation | Framer Motion |
| Routing | React Router DOM v6 |
| State | Zustand |
| Forms & Validation | React Hook Form + Zod |
| Icons | Lucide React |
| Charts | Recharts |
| Backend | Supabase (Postgres, Auth, Storage, Row Level Security) |

## 2. Getting Started

```bash
npm install
cp .env.example .env        # then fill in your Supabase URL + anon key
npm run dev
```

### Supabase setup

1. Create a new project at https://supabase.com.
2. Open the SQL editor and run, in order:
   - `supabase/schema.sql` — tables, enums, indexes, RLS policies, storage buckets
   - `supabase/seed.sql` — sample categories & products
3. Copy your Project URL and anon public key into `.env`.
4. To create the first admin account: sign up normally through the app, then in the
   SQL editor run:
   ```sql
   update profiles set role = 'admin' where email = 'you@example.com';
   ```

## 3. Folder Structure

```
src/
├── components/
│   ├── common/       # Modal, Pagination, EmptyState, Skeletons — used everywhere
│   ├── product/      # ProductCard, ProductFilters, CompareTable, OrderTimeline
│   ├── cart/         # (cart-specific pieces live inline in pages/customer/Cart.jsx)
│   ├── layout/        # Navbar, Footer, AdminSidebar
│   ├── admin/         # StatCard, DataTable, ProductForm
│   └── charts/        # SalesChart, TopProductsChart, CategoryPieChart
├── pages/
│   ├── customer/      # Home, Catalog, ProductDetail, Compare, BudgetSearch, Cart, Checkout, OrderHistory, OrderTracking
│   ├── admin/          # Dashboard, Products, Categories, Orders
│   └── auth/            # Login, Register, ForgotPassword
├── layouts/            # MainLayout (customer), AdminLayout (sidebar shell)
├── routes/             # ProtectedRoute, AdminRoute (guards)
├── store/              # authStore, cartStore, compareStore (Zustand)
├── hooks/              # (reserved for future shared hooks)
├── services/            # authService, productService, categoryService, cartService,
│                         # orderService, storageService, dashboardService — all Supabase calls
├── lib/                  # supabase.js (client singleton)
├── types/                # (reserved — add JSDoc typedefs or migrate to TS here)
├── utils/                # format.js (currency/date), status.js (order status constants)
└── assets/
```

**Design principle:** pages never call `supabase` directly — they always go through a
`service`. This keeps data-access logic in one place and makes it trivial to swap
Supabase for another backend later.

## 4. Roles & Access Control

- **Guest** — browse catalog, product detail, compare, budget search.
- **Customer** — everything a guest can do, plus cart, checkout, order tracking.
  Enforced client-side by `ProtectedRoute` and server-side by RLS policies keyed
  to `auth.uid()`.
- **Admin** — full dashboard, product/category/order management. Enforced by
  `AdminRoute` (checks `profiles.role`) and by the `is_admin()` policy helper in
  Postgres, so even a compromised frontend can't bypass it.

## 5. Order Status Flow

```
pending_payment → payment_verification → processing → shipping → delivered
                                                    ↘ cancelled (from any state)
```

Defined once in `src/utils/status.js` and rendered by `OrderTimeline.jsx`.

## 6. Production Best Practices

**Security**
- Row Level Security is enabled on every table — never disable it "temporarily."
- The anon key is safe to expose in the frontend; all real authorization happens
  in RLS policies, not in React code.
- Payment slip images live in a **private** bucket (`payment-slips`); only the
  uploading customer and admins can read them. Product images live in a public
  bucket since they're meant to be shown to guests.
- Validate all form input with Zod on the client, but also add Postgres `check`
  constraints (already in `schema.sql`) as the last line of defense.

**Performance**
- Product search uses a `pg_trgm` GIN index for fast `ILIKE` search at scale.
- List queries are paginated (`.range()`) — never fetch the full products table.
- Use Supabase's generated image transformation or a CDN in front of the storage
  bucket for product images once traffic grows.

**Reliability**
- `orderService.createOrder` rolls back the order row if `order_items` insert
  fails, avoiding orphaned orders. For true atomicity, promote this to a Postgres
  RPC function (`create_order(...)`) wrapped in a single transaction.
- Add a Postgres trigger or scheduled Edge Function to auto-cancel orders stuck
  in `pending_payment` for more than e.g. 24 hours.

**Code quality**
- Keep all Supabase calls inside `src/services/*` — pages/components should never
  import `supabase` directly.
- Co-locate Zod schemas with the form that uses them; don't share validation
  schemas between the client form and a hypothetical server endpoint without a
  single source of truth.
- Add ESLint + Prettier with a pre-commit hook before scaling the team.

**Before going live**
- Turn on Supabase's email confirmation for sign-up.
- Set up automated Postgres backups (Supabase Pro) or `pg_dump` on a schedule.
- Add rate limiting on auth endpoints (Supabase has built-in protections, but
  review the limits for your expected traffic).
- Replace the QR payment mockup with a real payment gateway (PromptPay API,
  Omise, or 2C2P are common choices in Thailand) before accepting real money.
"# Project-Module-AJ.Aekkarat" 
"# Project-Module-AJ.Aekkarat" 
