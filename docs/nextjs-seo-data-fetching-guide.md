# Next.js App Router — SEO & Data Fetching Guide

A practical guide for building SEO-friendly pages with the Next.js App Router, covering metadata, server/client components, data fetching patterns, and auth-aware server requests used in this project.

---

## Table of Contents

- [Project Structure](#project-structure)
- [Axios Setup](#axios-setup)
  - [Client Axios Instance](#client-axios-instance)
  - [Server Axios Instance (with Auth)](#server-axios-instance-with-auth)
- [Dynamic Rendering](#dynamic-rendering)
- [SEO Metadata](#seo-metadata)
  - [Static Metadata (layout.tsx)](#static-metadata-layouttsx)
  - [Dynamic Metadata (generateMetadata)](#dynamic-metadata-generatemetadata)
  - [Title Template](#title-template)
- [Server vs Client Components](#server-vs-client-components)
  - [When to Use Each](#when-to-use-each)
  - [The Server + Client Pattern](#the-server--client-pattern)
  - [Why NOT to Fetch in Client Components for SEO Pages](#why-not-to-fetch-in-client-components-for-seo-pages)
- [Data Fetching Patterns](#data-fetching-patterns)
  - [Server-Side Fetch (SEO-Critical)](#1-server-side-fetch-seo-critical)
  - [Parallel Fetching](#2-parallel-fetching)
  - [Sequential / Dependent Fetching](#3-sequential--dependent-fetching)
  - [Server + Client Hybrid](#4-server--client-hybrid)
  - [Client-Only Fetch](#5-client-only-fetch)
- [Auth in Server Components](#auth-in-server-components)
  - [Reading Cookies](#reading-cookies)
  - [Forwarding the Cookie Header](#forwarding-the-cookie-header)
  - [With Keycloak / next-auth](#with-keycloak--next-auth)
- [Decision Guide](#decision-guide)

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx                  # Root layout — static SEO metadata
│   ├── page.tsx                    # Home — server component, product listing
│   ├── globals.css                 # Tailwind CSS
│   └── products/
│       └── [id]/
│           ├── page.tsx            # Server component — generateMetadata + data fetch
│           └── product-detail.tsx  # Client component — useEffect, interactivity
├── lib/
│   ├── axios.ts                    # Base axios instance (client & shared)
│   └── axios-server.ts            # Server-only axios with auth cookie forwarding
└── types/
    └── product.ts                  # Shared Product interface
```

---

## Axios Setup

### Client Axios Instance

Located at `src/lib/axios.ts`. Base instance used for client-side requests and as the foundation for the server instance.

```ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
```

Set the base URL in `.env`:

```
NEXT_PUBLIC_API_BASE_URL=https://fakestoreapi.com
```

### Server Axios Instance (with Auth)

Located at `src/lib/axios-server.ts`. Reads auth cookies from the incoming request using `next/headers` and attaches them to outgoing API calls.

```ts
import { cookies } from "next/headers";
import axiosInstance from "./axios";

export async function getServerAxios() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  const instance = axiosInstance;
  if (token) {
    instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
  return instance;
}
```

**Use in server components:**

```ts
import { getServerAxios } from "@/lib/axios-server";

async function getProduct(id: string) {
  const axios = await getServerAxios();
  const { data } = await axios.get<Product>(`/products/${id}`);
  return data;
}
```

**Why two instances?**

| Instance | Used in | Auth | Access to cookies |
|---|---|---|---|
| `axios.ts` | Client components (`useEffect`) | Browser sends cookies automatically | N/A |
| `axios-server.ts` | Server components (`page.tsx`) | Manually reads from `next/headers` | Yes |

---

## Dynamic Rendering

Pages that fetch from external APIs at request time should use `force-dynamic` to prevent prerendering failures during build:

```ts
export const dynamic = "force-dynamic";
```

**Why?** During `next build` (or `vercel --prod`), Next.js tries to prerender pages. If the external API blocks cloud IPs or is unavailable during build, the build fails. `force-dynamic` skips prerendering and renders on every request instead.

**For ecommerce this is ideal** — products are always fresh, and pages are still fully server-rendered (SSR) for SEO.

---

## SEO Metadata

### Static Metadata (layout.tsx)

For pages where metadata doesn't depend on dynamic data, export a `metadata` object:

```ts
// src/app/layout.tsx
export const metadata: Metadata = {
  title: {
    default: "Kamal Shop - Your One-Stop Online Store",
    template: "%s | Kamal Shop",
  },
  description: "Shop the best deals on electronics, jewelry, clothing and more.",
  keywords: ["online shopping", "ecommerce", "kamal shop"],
  openGraph: {
    title: "Kamal Shop - Your One-Stop Online Store",
    description: "Shop the best deals at Kamal Shop.",
    type: "website",
    siteName: "Kamal Shop",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kamal Shop - Your One-Stop Online Store",
    description: "Shop the best deals at Kamal Shop.",
  },
  robots: { index: true, follow: true },
};
```

### Dynamic Metadata (generateMetadata)

For pages where metadata depends on fetched data (e.g., product title, description, image), use `generateMetadata`:

```ts
// src/app/products/[id]/page.tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  return {
    title: product.title,           // uses the template → "Product Name | Kamal Shop"
    description: product.description,
    openGraph: {
      title: `${product.title} | Kamal Shop`,
      description: product.description,
      images: [{ url: product.image, alt: product.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.title} | Kamal Shop`,
      images: [product.image],
    },
  };
}
```

**Key point:** `generateMetadata` runs on the server before the page renders. The resulting `<title>`, `<meta>`, and OG tags are included in the initial HTML response.

### Title Template

The `template` in the root layout's title config:

```ts
title: {
  default: "Kamal Shop - Your One-Stop Online Store",  // used when no child sets a title
  template: "%s | Kamal Shop",                          // wraps child page titles
}
```

When a child page sets `title: "Wireless Headphones"`, the rendered title becomes:
**"Wireless Headphones | Kamal Shop"**

---

## Server vs Client Components

### When to Use Each

| Feature | Server Component | Client Component |
|---|---|---|
| `async/await` data fetching | Yes | No |
| `generateMetadata` | Yes | No |
| `useEffect` / `useState` | No | Yes |
| Event handlers (onClick, etc.) | No | Yes |
| Browser APIs (localStorage, etc.) | No | Yes |
| Access to `cookies()` / `headers()` | Yes | No |
| SEO-friendly (HTML in initial response) | Yes | Depends* |

*Client components are server-rendered on first load (SSR), but data fetched in `useEffect` is NOT in the initial HTML.

### The Server + Client Pattern

This is the core architecture used in this project:

```
page.tsx (Server Component)
├── generateMetadata()       → dynamic SEO tags (title, OG, Twitter)
├── getServerAxios()         → reads auth cookie, creates authed axios
├── fetch data               → server-side, included in initial HTML
└── <ProductDetail />        → receives data as props
    ├── product content      → server-rendered, SEO-friendly ✅
    ├── useEffect()          → analytics, side effects (client-only)
    ├── useState()           → interactive UI state
    └── onClick handlers     → user interactions
```

**Example from this project:**

```ts
// page.tsx — Server Component
export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);       // fetched on server with auth
  return <ProductDetail product={product} />;  // passed as prop
}
```

```ts
// product-detail.tsx — Client Component
"use client";

export default function ProductDetail({ product }: { product: Product }) {
  useEffect(() => {
    console.log(`Viewed product: ${product.title}`);
  }, [product.id]);

  return ( /* render product UI — all content is in initial HTML */ );
}
```

**Why this works:**
- `product` data is fetched on the server → included in SSR HTML → search engines see it
- Auth token is read from cookies via `getServerAxios()` → API calls are authenticated
- `useEffect` runs only in the browser → used for non-SEO things (analytics, etc.)

### Why NOT to Fetch in Client Components for SEO Pages

```
❌ Bad for SEO                          ✅ Good for SEO
page.tsx passes only productId          page.tsx fetches product, passes as prop
  ↓                                       ↓
product-detail.tsx                      product-detail.tsx
  useEffect → fetch product               receives product prop
  initial HTML = "Loading..."             initial HTML = full product content
  Google sees nothing                     Google sees everything
  API called twice (metadata + client)    API called once on server
```

**Rule of thumb:** If content should be indexed by search engines, fetch it in the server component and pass it as props. Use `useEffect` only for non-SEO side effects.

---

## Data Fetching Patterns

### 1. Server-Side Fetch (SEO-Critical)

The simplest pattern. Fetch directly in the server component using the server axios instance.

```ts
// page.tsx
export default async function Home() {
  const axios = await getServerAxios();
  const { data: products } = await axios.get<Product[]>("/products");

  return (
    <div>
      {products.map((p) => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}
```

**Use when:** Content must be in the initial HTML for SEO (product listings, blog posts, etc.).

### 2. Parallel Fetching

When multiple independent API calls are needed, use `Promise.all` to run them concurrently:

```ts
export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const axios = await getServerAxios();

  const [product, reviews, recommendations] = await Promise.all([
    axios.get<Product>(`/products/${id}`),
    axios.get(`/products/${id}/reviews`),
    axios.get<Product[]>(`/products?limit=4`),
  ]);

  return (
    <ProductDetail
      product={product.data}
      reviews={reviews.data}
      recommendations={recommendations.data}
    />
  );
}
```

**Use when:** Multiple independent calls are all SEO-critical. Runs faster than sequential.

### 3. Sequential / Dependent Fetching

When the second call depends on the first call's result:

```ts
export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const axios = await getServerAxios();

  const { data: product } = await axios.get<Product>(`/products/${id}`);

  // needs product.category from the first call
  const { data: similar } = await axios.get<Product[]>(
    `/products/category/${product.category}`
  );

  return <ProductDetail product={product} similar={similar} />;
}
```

**Use when:** Call B requires data from Call A. Both are SEO-critical.

### 4. Server + Client Hybrid

Fetch critical data on the server, non-critical data on the client:

```ts
// page.tsx — critical data on server
export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const axios = await getServerAxios();
  const { data: product } = await axios.get<Product>(`/products/${id}`);

  return <ProductDetail product={product} />;
}
```

```ts
// product-detail.tsx — non-critical data on client
"use client";

export default function ProductDetail({ product }: { product: Product }) {
  const [similar, setSimilar] = useState<Product[]>([]);

  useEffect(() => {
    axiosInstance
      .get<Product[]>(`/products/category/${product.category}`)
      .then(({ data }) => {
        setSimilar(data.filter((p) => p.id !== product.id));
      });
  }, [product.id, product.category]);

  return (
    <>
      {/* product detail — server-rendered, SEO-friendly */}
      {/* similar products — loads after hydration, not critical for SEO */}
    </>
  );
}
```

**Use when:** Primary content needs SEO; secondary content (recommendations, reviews, related items) can load after.

### 5. Client-Only Fetch

Everything fetched in `useEffect`. The initial HTML has no data (just a loading state).

```ts
"use client";

export default function ProductDetail({ id }: { id: string }) {
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    axiosInstance.get<Product>(`/products/${id}`).then(({ data }) => {
      setProduct(data);
    });
  }, [id]);

  if (!product) return <div>Loading...</div>;
  return ( /* render product */ );
}
```

**Use when:** The page doesn't need SEO (dashboards, admin panels, user settings).

**Avoid when:** Content should be indexed by search engines.

---

## Auth in Server Components

Server components run on Node.js — there's no `document.cookie`. You must explicitly read cookies from the incoming request.

### Reading Cookies

Use `cookies()` from `next/headers` (this is what `axios-server.ts` does):

```ts
import { cookies } from "next/headers";

const cookieStore = await cookies();
const token = cookieStore.get("auth_token")?.value;
```

### Forwarding the Cookie Header

For session-based auth where the API expects the raw cookie string:

```ts
import { headers } from "next/headers";

const headersList = await headers();
const cookie = headersList.get("cookie") ?? "";

await axiosInstance.get("/api/data", {
  headers: { Cookie: cookie },
});
```

### With Keycloak / next-auth

When using Keycloak via next-auth, replace cookie reading with `auth()`:

```ts
import { auth } from "@/lib/auth";

async function getProduct(id: string) {
  const session = await auth();

  const { data } = await axiosInstance.get<Product>(`/products/${id}`, {
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });
  return data;
}
```

| Context | How to get auth token |
|---|---|
| **Server Component** (`page.tsx`) | `cookies()` or `headers()` from `next/headers`, or `auth()` from next-auth |
| **Client Component** (`"use client"`) | Browser sends cookies automatically, or use axios interceptor with `document.cookie` |
| **Middleware** | `request.cookies.get("auth_token")` |

---

## Decision Guide

```
Is the data needed for SEO?
├── YES → Fetch in Server Component (page.tsx) using getServerAxios()
│   ├── Multiple independent calls? → Promise.all (parallel)
│   ├── Call B depends on Call A?   → Sequential (await A, then await B)
│   └── Also need useEffect?       → Server fetch + pass to Client Component as props
│
└── NO → Fetch in Client Component (useEffect) using axiosInstance
    └── Dashboard, admin, user-specific content
```

### Quick Reference

| Pattern | SEO | Speed | Complexity | Use Case |
|---|---|---|---|---|
| Server fetch (`getServerAxios`) | Full | Fast | Low | Product pages, listings |
| Parallel server | Full | Fastest | Low | Multiple independent APIs |
| Sequential server | Full | Slower | Low | Dependent API calls |
| Server + Client hybrid | Partial | Fast | Medium | Critical + non-critical data |
| Client-only (`axiosInstance`) | None | Slowest* | Low | Dashboards, admin panels |

*Slowest for first meaningful paint since data loads after JavaScript hydration.
