import type { Metadata } from "next";
import { getServerAxios } from "@/lib/axios-server";
import type { Product } from "@/types/product";
import ProductDetail from "./product-detail";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

async function getProduct(id: string): Promise<Product> {
  const axios = await getServerAxios();
  const { data } = await axios.get<Product>(`/products/${id}`);
  return data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  return {
    title: product.title,
    description: product.description,
    openGraph: {
      title: `${product.title} | Kamal Shop`,
      description: product.description,
      images: [{ url: product.image, alt: product.title }],
      type: "website",
      siteName: "Kamal Shop",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.title} | Kamal Shop`,
      description: product.description,
      images: [product.image],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);

  return <ProductDetail product={product} />;
}
