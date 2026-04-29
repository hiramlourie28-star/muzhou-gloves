"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export default function FactoryShowcase() {
  const t = useTranslations("factory");

  const stats = [
    { label: t("stats1"), value: t("stats2") },
    { label: t("stats3"), value: t("stats4") },
    { label: t("stats5"), value: t("stats6") },
  ];

  return (
    <section className="py-24 px-6 bg-mountain-800 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text side */}
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-peak-gold-light mb-4">
              {t("subtitle")}
            </p>
            <h2 className="text-3xl md:text-5xl font-serif mb-6">
              {t("title")}
            </h2>
            <p className="text-white/70 text-sm leading-relaxed max-w-md mb-12">
              {t("desc")}
            </p>

            <div className="grid grid-cols-3 gap-8">
              {stats.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.2 }}
                  viewport={{ once: true }}
                >
                  <span className="block text-2xl md:text-3xl font-serif text-peak-gold mb-1">
                    {s.value}
                  </span>
                  <span className="text-white/50 text-xs tracking-wide">
                    {s.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Image side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative aspect-square bg-mountain-700 overflow-hidden"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-7xl mb-4 opacity-30">🏭</div>
                <p className="text-white/50 text-xs tracking-widest uppercase">
                  {t("title")}
                </p>
              </div>
            </div>
            {/* Decorative grid pattern */}
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
