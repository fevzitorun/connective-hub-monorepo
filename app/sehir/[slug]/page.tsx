import { notFound } from "next/navigation";
import { CITIES, getCityBySlug } from "@/lib/cities";
import CityPageClient from "./client";

// Generate static params for all 10 cities
export function generateStaticParams() {
  return CITIES.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const city = getCityBySlug(params.slug);
  if (!city) return {};
  return {
    title: `${city.nameFull} Gayrimenkul İlanları | 7fil`,
    description: city.desc,
  };
}

export default function CityPage({ params }: { params: { slug: string } }) {
  const city = getCityBySlug(params.slug);
  if (!city) notFound();
  return <CityPageClient city={city} />;
}
