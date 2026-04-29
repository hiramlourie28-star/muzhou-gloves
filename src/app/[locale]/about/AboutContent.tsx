"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

const timeline = [
  { year: "item1_year", desc: "item1_desc" },
  { year: "item2_year", desc: "item2_desc" },
  { year: "item3_year", desc: "item3_desc" },
  { year: "item4_year", desc: "item4_desc" },
];

export default function AboutContent() {
  const t = useTranslations();

  return (
    <div className="pt-24 pb-16">
      {/* Hero */}
      <section className="py-24 px-6 bg-mountain-800 text-white text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-peak-gold-light mb-4">
          MUZHOU GLOVES
        </p>
        <h1 className="text-3xl md:text-5xl font-serif mb-6">{t("about.title")}</h1>
        <p className="text-white/50 text-sm max-w-xl mx-auto leading-relaxed">
          {t("about.subtitle")}
        </p>
      </section>

      {/* Intro */}
      <section className="py-20 px-6 max-w-4xl mx-auto text-center">
        <p className="text-alpine-500 text-sm leading-relaxed mb-6">
          {t("about.intro")}
        </p>
        <p className="text-alpine-500 text-sm leading-relaxed">
          {t("about.intro2")}
        </p>
      </section>

      {/* Timeline */}
      <section className="py-20 px-6 bg-summit-white">
        <h2 className="text-center text-2xl font-serif text-mountain-800 mb-16">
          {t("about.timeline.title")}
        </h2>
        <div className="max-w-2xl mx-auto">
          {timeline.map((item, i) => (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="flex gap-8 pb-12 relative"
            >
              <div className="hidden sm:block w-20 text-right shrink-0">
                <span className="text-sm font-serif text-peak-gold">
                  {t(`about.timeline.${item.year}`)}
                </span>
              </div>
              <div className="relative flex items-start gap-4">
                <div className="hidden sm:block w-2 h-2 mt-1.5 shrink-0 bg-peak-gold" />
                <div>
                  <span className="sm:hidden text-xs text-peak-gold font-medium mb-2 block">
                    {t(`about.timeline.${item.year}`)}
                  </span>
                  <p className="text-alpine-500 text-sm">{t(`about.timeline.${item.desc}`)}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quality */}
      <section className="py-20 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-serif text-mountain-800 mb-6">
          {t("about.cert_title")}
        </h2>
        <p className="text-alpine-500 text-sm max-w-xl mx-auto leading-relaxed">
          {t("about.cert_desc")}
        </p>
      </section>
    </div>
  );
}
