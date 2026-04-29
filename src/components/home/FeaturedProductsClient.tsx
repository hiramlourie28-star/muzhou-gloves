"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface Item {
  slug: string;
  image: string;
  categoryLabel: string;
  name: string;
}

interface Props {
  locale: string;
  title: string;
  subtitle: string;
  viewDetailLabel: string;
  items: Item[];
}

export default function FeaturedProductsClient({
  locale,
  title,
  subtitle,
  viewDetailLabel,
  items,
}: Props) {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.2em] text-alpine-400 mb-4">
            {subtitle}
          </p>
          <h2 className="text-3xl md:text-5xl font-serif text-mountain-800">{title}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((p, i) => (
            <motion.div
              key={p.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <Link href={`/${locale}/products/${p.slug}`}>
                <div className="relative aspect-[3/4] overflow-hidden bg-glacier-200 mb-4">
                  {p.image && (
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                  )}
                </div>
                <p className="text-xs uppercase tracking-widest text-alpine-400 mb-1">
                  {p.categoryLabel}
                </p>
                <h3 className="text-sm font-medium text-mountain-800 mb-2 line-clamp-2">
                  {p.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-alpine-500 group-hover:text-peak-gold transition-colors">
                    {viewDetailLabel}
                  </span>
                  <span className="text-xs text-alpine-400">&rarr;</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
