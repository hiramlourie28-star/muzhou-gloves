"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface Props {
  index: number;
  locale: string;
  slug: string;
  image: string;
  categoryLabel: string;
  name: string;
  viewDetailLabel: string;
}

export default function ProductCard({
  index,
  locale,
  slug,
  image,
  categoryLabel,
  name,
  viewDetailLabel,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      viewport={{ once: true }}
      className="group"
    >
      <Link href={`/${locale}/products/${slug}`}>
        <div className="relative aspect-[3/4] overflow-hidden bg-glacier-200 mb-4">
          {image && (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          )}
        </div>
        <p className="text-xs uppercase tracking-widest text-alpine-400 mb-1">
          {categoryLabel}
        </p>
        <h3 className="text-sm font-medium text-mountain-800 mb-2 line-clamp-2">
          {name}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-xs text-alpine-500 group-hover:text-peak-gold transition-colors">
            {viewDetailLabel}
          </span>
          <span className="text-xs text-alpine-400">&rarr;</span>
        </div>
      </Link>
    </motion.div>
  );
}
