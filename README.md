# ApexTek POS — Smart Point of Sale System

A fully-featured, mobile-responsive Point of Sale (POS) frontend built with **Next.js 14**, **shadcn/ui**, **Tailwind CSS v4**, and **Zustand**.

---

## ✨ Features

### 🛒 Point of Sale (POS)
- Product search with barcode scanner support (global `keydown` buffer)
- Category filter grid with image cards
- Real-time cart management (qty controls, per-line discounts)
- Checkout modal: cash / card / mobile money, change calculation
- Printable receipt with business logo and line items
- Keyboard shortcuts: **F1** (search), **F4** (checkout), **ESC** (clear cart)

### 📦 Inventory Management
- Product CRUD with SKU, barcode, category, supplier, price/cost, stock
- Category and supplier management
- Purchase orders with "Mark Received" → auto-updates stock
- Low stock alerts (badge in sidebar, alerts in dashboard)

### 👥 CRM & Customers
- Customer profiles with loyalty points, wallet balance, purchase history
- Add/edit/delete customers
- Invoice creation with line items, tax, due dates

### 💰 Transactions
- Full transaction history with filtering by date, cashier, payment method
- Receipt viewer for any past transaction
- Refund / reversal with stock restoration

### 📊 Reports & Analytics
- Daily revenue bar chart (Recharts)
- Orders trend line chart
- Payment method pie chart
- Top-selling products table
- CSV export for any date range

### 🔔 Notifications
- Real-time notification center (low stock, sales, customers)
- Bell icon in topbar with unread count badge
- Mark read / mark all read

### 🏢 Business Management
- Business profile (name, logo, address, tax number)
- Multi-branch support with branch switcher
- User management with role-based access control (Admin / Manager / Cashier)
- Tabbed settings: tax rate, currency, notifications, appearance

### 💳 Payment Integrations
- Configuration UI for Stripe, Paystack, Flutterwave, MTN MoMo
- Test/live mode toggle, key management

### 🔍 Global Search
- `Ctrl+K` / `⌘K` to open
- Searches products, customers, transactions, and pages
- Keyboard navigation (↑↓ + Enter)

### ⌨️ Keyboard Shortcuts
- Press `?` anywhere to see shortcuts modal
- `Alt+D` → Dashboard, `Alt+P` → POS, `Alt+I` → Inventory

### 📱 PWA Ready
- `manifest.json` with shortcuts
- Offline indicator banner
- Install-ready on mobile/desktop

### ♿ Accessibility
- Skip-to-main-content link
- ARIA labels on interactive elements
- Focus management in modals

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| UI | shadcn/ui (on `@base-ui/react`) + Tailwind CSS v4 |
| State | Zustand + `persist` middleware |
| Forms | React Hook Form + Zod v4 |
| Charts | Recharts |
| Icons | Lucide React |
| Notifications | Sonner (toast) |
| Language | TypeScript |

> **⚠️ Important:** This project uses shadcn/ui built on `@base-ui/react`, NOT Radix UI. The `asChild` prop is not supported — use inline `className` on trigger elements instead. Use native `<select>` elements where shadcn `Select` causes TypeScript issues.

---

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Demo Accounts

| Role | Email | Password | PIN |
|---|---|---|---|
| Admin | admin@apextek.com | any | 1234 |
| Manager | manager@apextek.com | any | 5678 |
| Cashier | cashier@apextek.com | any | 0000 |

---

## 📁 Project Structure

```
pos-frontend/
├── app/
│   ├── (auth)/           # Login, PIN, Register, Forgot Password
│   └── (dashboard)/      # All protected dashboard pages
│       ├── page.tsx       # KPI Dashboard
│       ├── pos/           # POS Checkout
│       ├── inventory/     # Products
│       ├── categories/    # Product categories
│       ├── suppliers/     # Suppliers
│       ├── purchase-orders/
│       ├── transactions/
│       ├── customers/     # CRM
│       ├── invoices/      # Billing
│       ├── reports/       # Analytics
│       ├── notifications/
│       ├── users/         # User management
│       ├── branches/      # Multi-branch
│       ├── business/      # Business profile
│       ├── settings/      # App settings
│       ├── payment-integrations/
│       └── help/          # Help & FAQ
├── components/
│   ├── layout/            # Sidebar, Topbar
│   ├── pos/               # Cart, ProductGrid, CheckoutModal, Receipt
│   ├── inventory/         # ProductFormDialog, ProductTable
│   └── shared/            # StatCard, GlobalSearch, LoadingSkeleton, OfflineIndicator, KeyboardShortcutsModal
├── lib/
│   ├── mock/              # Mock data
│   ├── store/             # Zustand stores
│   ├── types/             # TypeScript interfaces
│   ├── i18n/              # Translation files (en, fr)
│   └── utils.ts
└── __tests__/             # Jest unit tests (scaffolded)
```

---

## 🔐 RBAC Roles

| Feature | Admin | Manager | Cashier |
|---|---|---|---|
| POS Checkout | ✅ | ✅ | ✅ |
| Inventory CRUD | ✅ | ✅ | ❌ |
| Purchase Orders | ✅ | ✅ | ❌ |
| Customers / CRM | ✅ | ✅ | ❌ |
| Reports | ✅ | ✅ | ❌ |
| User Management | ✅ | ❌ | ❌ |
| Business Settings | ✅ | ❌ | ❌ |
| Payment Integrations | ✅ | ❌ | ❌ |

---

## 🧪 Testing

Unit test scaffolds in `__tests__/`. Install and run:

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom @types/jest
npx jest
```

---

## 🌐 i18n

Translation files in `lib/i18n/` — English and French. Use `t('nav.dashboard')` helper.

---

## 📝 License

Proprietary — Apex Technologies. All rights reserved.
