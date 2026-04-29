"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface Item {
  key: string;
  label: string;
  image: string | null;
}

interface Props {
  locale: string;
  title: string;
  subtitle: string;
  items: Item[];
}

const fallbackEmoji: Record<string, string> = {
  ski: "🏔️",
  leather: "🫱",
  fabric: "🧶",
  splice: "🧵",
  mittens: "🧤",
  animals: "🐻",
  fingerless: "✌️",
  lace: "🌸",
  sports: "🚴",
};

export default function CategoryGridClient({ locale, title, subtitle, items }: Props) {
  return (
    <section className="py-24 px-6 bg-summit-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.2em] text-alpine-400 mb-4">
            {subtitle}
          </p>
          <h2 className="text-3xl md:text-5xl font-serif text-mountain-800">{title}</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {items.map((cat, i) => (
            <motion.div
              key={cat.key}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              viewport={{ once: true }}
            >
              <Link
                href={`/${locale}/products?category=${cat.key}`}
                className="group block relative aspect-[3/4] overflow-hidden bg-glacier-200"
              >
                {cat.image ? (
                  <Image
                    src={cat.image}
                    alt={cat.label}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-30">
                    {fallbackEmoji[cat.key] ?? "🧤"}
                  </div>
                )}
                <div className="absolute inset-0 bg-mountain-900/40 group-hover:bg-mountain-900/50 transition-colors duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white text-sm font-medium tracking-wide">
                    {cat.label}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
