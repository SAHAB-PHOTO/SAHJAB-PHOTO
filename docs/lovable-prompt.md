# Lovable Prompt — Halawiyat El Djazair

Copy everything between the dashed lines below and paste it as a single
prompt into Lovable (https://lovable.dev). Lovable handles long briefs
well — keep the structure intact so the planner can chunk the work
into pages.

---

Build a premium marketplace web app called **"حلويات الجزائر" (Halawiyat El Djazair)** — a commission-based platform connecting Algerian sweets/pastry sellers with buyers across all 58 wilayas of Algeria. Think Talabat, but exclusively for traditional and modern Algerian sweets, with a luxurious editorial aesthetic.

## Business Model
- Marketplace with 3 roles: Buyer, Seller (pastry shops & home bakers), Admin
- Platform takes a configurable commission (default 10%) on every order
- Sellers register, get verified, list products; buyers browse, order, pay, receive
- Reviews, ratings, and seller verification badges

## User Roles & Features

**Buyer:**
- Browse by category (Traditional, Modern, Cakes, Chocolate, Gluten-free…), wilaya, price, rating
- Product page: multiple photos, ingredients, allergens, prep time, seller info, reviews
- Cart, checkout, order tracking (pending → preparing → ready → delivered)
- Favorites/wishlist, saved addresses, full order history
- Reviews & ratings post-delivery

**Seller (Shop Owner):**
- Registration with document upload (commerce register / ID for home bakers) + admin approval
- Dashboard: revenue, orders today, top products, weekly/monthly analytics charts
- Product management (add/edit, multiple photos, variants, stock, scheduled availability)
- Order management with status transitions
- Earnings page: gross sales, commission deducted, net payout, payout history
- Shop profile customization (logo, banner, story, working hours, delivery zones)

**Admin:**
- KPIs dashboard (GMV, commission earned, active sellers, orders today)
- Seller approval queue with document review
- Dispute resolution panel, refund management
- Commission rate control (global + per-category override)
- Category & banner management
- User management (ban, verify, promote)
- Financial reports exportable to CSV

## Algeria-Specific Requirements
- Wilaya selector with ALL 58 wilayas: Adrar, Chlef, Laghouat, Oum El Bouaghi, Batna, Béjaïa, Biskra, Béchar, Blida, Bouira, Tamanrasset, Tébessa, Tlemcen, Tiaret, Tizi Ouzou, Alger, Djelfa, Jijel, Sétif, Saïda, Skikda, Sidi Bel Abbès, Annaba, Guelma, Constantine, Médéa, Mostaganem, M'Sila, Mascara, Ouargla, Oran, El Bayadh, Illizi, Bordj Bou Arréridj, Boumerdès, El Tarf, Tindouf, Tissemsilt, El Oued, Khenchela, Souk Ahras, Tipaza, Mila, Aïn Defla, Naâma, Aïn Témouchent, Ghardaïa, Relizane, Timimoun, Bordj Badji Mokhtar, Ouled Djellal, Béni Abbès, In Salah, In Guezzam, Touggourt, Djanet, El M'Ghair, El Meniaa. Provide both Arabic and French names.
- Payment methods: CIB card, Edahabia, BaridiMob, Cash on Delivery
- Phone: +213 format with validation
- Currency: Algerian Dinar (DZD) — format as "1 250 دج"
- Language: Arabic (primary, RTL) with French toggle in header
- Default layout direction: RTL

## Design System — Luxurious, Editorial, Premium
- Palette:
  • Primary gold: #C9A961
  • Deep brown: #2B1810
  • Cream background: #FAF7F2
  • Rose gold accent: #B76E79
  • Emerald success: #0F5132
- Typography:
  • Arabic headings: "Amiri" or "Reem Kufi"
  • Arabic body: "Tajawal" or "Cairo"
  • Latin headings: "Playfair Display"
  • Latin body: "Inter"
- Visual style:
  • Generous whitespace, soft shadows, rounded corners (14px)
  • Gallery-style product cards with hover lift + gold border glow
  • Hero with full-bleed lifestyle imagery of premium Algerian sweets (baklawa, makroud, kalb el louz, ghribia, mhalbi)
  • Subtle gold gradient dividers, never garish
  • Editorial micro-animations on scroll (Framer Motion: fade-up, stagger)
  • Bottom navigation on mobile, sticky top nav on desktop

## Pages to Build (in this order)
1. Landing page — hero, "How it works" 3-step, featured sellers carousel, popular categories grid, top-rated sweets, "Become a Seller" CTA section, footer with wilaya coverage map
2. Auth flow — sign up / sign in / phone OTP / forgot password
3. Browse page — filters sidebar (wilaya, category, price, rating, delivery time), sort, grid/list toggle
4. Product detail page — image gallery, seller card, reviews, "Add to cart"
5. Seller shop page — banner, story, all products, reviews
6. Cart + multi-step checkout (address → delivery → payment → confirm)
7. Order tracking page with live status timeline
8. Buyer dashboard
9. Seller registration (multi-step wizard) + Seller dashboard
10. Admin dashboard

## Tech Stack
- React + TypeScript + Vite
- Tailwind CSS with RTL plugin enabled by default
- shadcn/ui components
- Supabase (auth + Postgres + Storage for product photos)
- React Router
- Lucide React icons
- Framer Motion for animations
- React Hook Form + Zod for validation

## Supabase Schema
- profiles (id, role['buyer'|'seller'|'admin'], full_name, phone, wilaya, avatar_url)
- shops (id, owner_id, name_ar, name_fr, slug, description, logo_url, banner_url, wilaya, verified, rating_avg, total_sales)
- products (id, shop_id, name_ar, name_fr, description, price_dzd, category_id, photos[], stock, allergens[], prep_time_hours, active)
- categories (id, name_ar, name_fr, slug, icon, sort_order)
- orders (id, buyer_id, shop_id, items_json, subtotal, commission_rate, commission_amount, total, payment_method, status, delivery_address, delivery_wilaya, created_at)
- reviews (id, order_id, buyer_id, shop_id, rating, comment, created_at)
- payouts (id, shop_id, amount, period_start, period_end, status)

## Quality Bar
Every screen must be production-grade: flawless RTL, smooth animations, real placeholder content (no Lorem Ipsum — use realistic Arabic sweet names and Algerian seller names), responsive on mobile/tablet/desktop. Start with the landing page + auth, then build the buyer browse flow end-to-end before moving to seller/admin dashboards.

---

## How to use this with Lovable

1. Go to https://lovable.dev and sign in
2. Click **"New Project"** (or the prompt input on the home screen)
3. Paste the entire block above (between the `---` lines)
4. Press send. Lovable will start scaffolding — first the landing page,
   then the rest in the order specified
5. Once it boots, ask follow-up turns like:
   - "Now add the buyer browse page exactly as specified"
   - "Connect Supabase and create the tables in the schema section"
   - "Refine the hero — make the typography larger and the imagery more editorial"
