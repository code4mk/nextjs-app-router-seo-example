# Next.js App Router — SEO & Data Fetching Guide

A practical guide for building SEO-friendly pages with the Next.js App Router, covering metadata, server/client components, and data fetching patterns used in this project.

---

## Table of Contents

- [Project Structure](#project-structure)
- [Axios Instance](#axios-instance)
- [SEO Metadata](#seo-metadata)
  - [Static Metadata (layout.tsx)](#static-metadata-layouttsx)
  - [Dynamic Metadata (generateMetadata)](#dynamic-metadata-generatemetadata)
  - [Title Template](#title-template)
- [Server vs Client Components](#server-vs-client-components)
  - [When to Use Each](#when-to-use-each)
  - [The Server + Client Pattern](#the-server--client-pattern)
- [Data Fetching Patterns](#data-fetching-patterns)
  - [Server-Side Fetch (SEO-Critical)](#1-server-side-fetch-seo-critical)
  - [Parallel Fetching](#2-parallel-fetching)
  - [Sequential / Dependent Fetching](#3-sequential--dependent-fetching)
  - [Server + Client Hybrid](#4-server--client-hybrid)
  - [Client-Only Fetch](#5-client-only-fetch)
- [Decision Guide](#decision-guide)

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout — static metadata
│   ├── page.tsx                # Home — server component, product listing
│   ├── globals.css             # Tailwind CSS
│   └── products/
│       └── [id]/
│           ├── page.tsx        # Server component — generateMetadata + data fetch
│           └── product-detail.tsx  # Client component — useEffect, interactivity
├── lib/
│   └── axios.ts                # Axios instance with base URL & interceptors
└── types/
    └── product.ts              # Shared Product interface
```

---

## Axios Instance

Located at `src/lib/axios.ts`. Configured with environment variables for the base URL.

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

Import anywhere:

```ts
import axiosInstance from '@/lib/axios';
```

---

## SEO Metadata

### Static Metadata (layout.tsx)

For pages where metadata doesn't depend on dynamic data, export a `metadata` object from `layout.tsx` or `page.tsx`:

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
| SEO-friendly (HTML in initial response) | Yes | Depends* |

*Client components are server-rendered on first load (SSR), but data fetched in `useEffect` is NOT in the initial HTML.

### The Server + Client Pattern

This is the core architecture used in this project:

```
page.tsx (Server Component)
├── generateMetadata()    → dynamic SEO tags
├── fetch data            → server-side, in initial HTML
└── <ClientComponent />   → receives data as props
    ├── useEffect()       → analytics, side effects
    ├── useState()        → interactive UI state
    └── onClick handlers  → user interactions
```

**Example:**

```ts
// page.tsx — Server Component
export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);       // fetched on server
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

  return ( /* render product UI */ );
}
```

**Why this works:**
- `product` data is fetched on the server → included in SSR HTML → search engines see it
- `useEffect` runs only in the browser → used for non-SEO things (analytics, etc.)

---

## Data Fetching Patterns

### 1. Server-Side Fetch (SEO-Critical)

The simplest pattern. Fetch directly in the server component.

```ts
// page.tsx
export default async function Home() {
  const { data: products } = await axiosInstance.get<Product[]>("/products");

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

  const [product, reviews, recommendations] = await Promise.all([
    axiosInstance.get<Product>(`/products/${id}`),
    axiosInstance.get(`/products/${id}/reviews`),
    axiosInstance.get<Product[]>(`/products?limit=4`),
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

  const { data: product } = await axiosInstance.get<Product>(`/products/${id}`);

  // needs product.category from the first call
  const { data: similar } = await axiosInstance.get<Product[]>(
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
  const { data: product } = await axiosInstance.get<Product>(`/products/${id}`);

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

## Decision Guide

```
Is the data needed for SEO?
├── YES → Fetch in Server Component (page.tsx)
│   ├── Multiple independent calls? → Promise.all (parallel)
│   ├── Call B depends on Call A?   → Sequential (await A, then await B)
│   └── Also need useEffect?       → Server fetch + pass to Client Component as props
│
└── NO → Fetch in Client Component (useEffect)
    └── Dashboard, admin, user-specific content
```

### Quick Reference

| Pattern | SEO | Speed | Complexity | Use Case |
|---|---|---|---|---|
| Server fetch | Full | Fast | Low | Product pages, listings |
| Parallel server | Full | Fastest | Low | Multiple independent APIs |
| Sequential server | Full | Slower | Low | Dependent API calls |
| Server + Client hybrid | Partial | Fast | Medium | Critical + non-critical data |
| Client-only | None | Slowest* | Low | Dashboards, admin panels |

*Slowest for first meaningful paint since data loads after JavaScript hydration.
