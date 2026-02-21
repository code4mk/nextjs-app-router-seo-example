# Next.js App Router SEO Example

A practical example of building an SEO-friendly ecommerce site using **Next.js App Router**, demonstrating dynamic metadata, server/client component patterns, and data fetching strategies.

## Tech Stack

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **Axios**

## Features

- Static metadata in root layout (title template, Open Graph, Twitter cards, robots)
- Dynamic `generateMetadata` for product pages (title, description, OG image from API)
- Server-side data fetching for SEO-critical content
- Server + Client component pattern (server fetch → pass props → client interactivity)
- Axios instance with base URL, interceptors, and timeout config
- Responsive product grid and detail page with dark mode support

## Project Structure

```
src/
├── app/
│   ├── layout.tsx                  # Root layout — static SEO metadata
│   ├── page.tsx                    # Home — server-rendered product listing
│   ├── globals.css
│   └── products/
│       └── [id]/
│           ├── page.tsx            # Server component — generateMetadata + fetch
│           └── product-detail.tsx  # Client component — useEffect, interactivity
├── lib/
│   └── axios.ts                    # Axios instance
└── types/
    └── product.ts                  # Shared Product interface
```

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Set up environment variables

Copy the example env file and update as needed:

```bash
cp .env.example .env
```

```
NEXT_PUBLIC_API_BASE_URL=https://fakestoreapi.com
```

### 3. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the product listing.

## Documentation

See [`docs/nextjs-seo-data-fetching-guide.md`](docs/nextjs-seo-data-fetching-guide.md) for a detailed guide on:

- SEO metadata (static vs dynamic)
- Server vs Client components
- Data fetching patterns (parallel, sequential, hybrid, client-only)
- Decision guide for choosing the right approach

## API

This project uses [Fake Store API](https://fakestoreapi.com) for demo product data.

## License

MIT
