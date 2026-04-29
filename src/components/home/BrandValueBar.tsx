"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export default function BrandValueBar() {
  const t = useTranslations("brand");

  const values = [
    { key: "experience", number: "30+" },
    { key: "capacity", number: "1M+" },
    { key: "quality", number: "30+" },
  ];

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1 bg-glacier-200">
          {values.map((v, i) => (
            <motion.div
              key={v.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-12 text-center"
            >
              <span className="text-4xl md:text-5xl font-serif text-peak-gold block mb-4">
                {v.number}
              </span>
              <h3 className="text-mountain-800 text-sm font-medium tracking-wide mb-2">
                {t(`${v.key}.title`)}
              </h3>
              <p className="text-alpine-500 text-xs leading-relaxed max-w-[200px] mx-auto">
                {t(`${v.key}.desc`)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
