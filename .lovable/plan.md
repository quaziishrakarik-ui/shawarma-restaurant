

# 🍽️ Restaurant Business Website Template

A full-stack, reusable restaurant website with dynamic content managed entirely from an admin dashboard. All content loaded from Supabase — zero hardcoded data.

---

## Phase 1: Database & Backend Setup

### Supabase Schema
- **`site_settings`** — Single-row table for hero title, subtitle, about text, SEO meta, colors, logo, favicon, social links
- **`categories`** — Menu categories (id, name, sort_order)
- **`menu_items`** — Menu items linked to categories (name, description, price, image_url, is_available, is_featured, category_id FK)
- **`locations`** — Branches with independent contact info (name, address, phone, whatsapp_number, whatsapp_link, maps_embed)
- **`user_roles`** — Admin role management using `app_role` enum with `has_role()` security definer function

### Admin Setup Workflow (Simplified)
- A database trigger automatically assigns the `admin` role to the **first user** who signs up
- For subsequent clients/deployments: sign up once → you're admin → done
- Additional admins can be added later from the admin dashboard if needed
- No manual SQL or role assignment required for the initial setup

### Storage Buckets
- `images` bucket for hero background, about image, menu item photos, logo, favicon

### Security
- RLS enabled on all tables
- Public read access for all content tables
- Admin-only write access using `has_role()` security definer function
- Supabase Auth with email/password login

---

## Phase 2: Public Website

### Homepage
- Hero section with dynamic title, subtitle, background image
- Featured menu items grid (items marked as featured)
- About preview section
- Call Now CTA button (phone link)
- Social media icons (Facebook, Instagram)
- Footer with address, phone, WhatsApp, social links

### Menu Page
- Category filter tabs/buttons
- Grid of menu items showing image, name, short description, price, availability badge
- Unavailable items visually dimmed/marked
- Click navigates to individual item page

### Menu Item Page (`/menu/:id`)
- Large image, full description, price, category, availability indicator
- Call Now button, Back to Menu button

### About Page
- Editable title, description, image
- "Our Locations" section with all branches
- Each branch: name, address, phone, WhatsApp, Google Maps embed

### Contact Page
- All branches listed with their independent contact details
- Clickable phone, WhatsApp button, address, Google Maps embed per branch
- Facebook & Instagram buttons

### Global
- Dynamic SEO meta title & description
- Dynamic favicon & logo
- Dynamic primary/secondary/background colors applied via CSS variables
- Fully responsive mobile-first design
- Modern, clean UI with smooth loading states

---

## Phase 3: Admin Dashboard

### Auth Flow
- Login page at `/admin` with email/password
- First signup automatically becomes admin — no manual role assignment
- Protected routes — only users with `admin` role can access
- Simple login → you're in

### Dashboard Sections

**Website Settings**
- Edit hero title, subtitle, upload hero background
- Edit about title, description, upload about image
- Edit locations section title
- Social media URLs (Facebook, Instagram)
- SEO meta title & description
- Upload favicon & logo
- Color pickers for primary, secondary, background colors

**Locations Management**
- CRUD for branches
- Each branch: name, address, phone, WhatsApp number, WhatsApp link, Google Maps embed code
- Independent contact info per branch

**Category Management**
- Add, edit, delete categories
- Reorder categories

**Menu Management**
- Add, edit, delete menu items
- Upload item image
- Assign to category
- Set price, description
- Toggle availability
- Toggle featured status

---

## Phase 4: Polish & Production Readiness

- Loading skeletons for all dynamic content
- Error handling and toast notifications
- Image optimization and lazy loading
- Clean, modular code structure for template reuse
- Responsive testing across all breakpoints

