"use client";

import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroSection() {
  const t = useTranslations("hero");
  const locale = useLocale();

  return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-mountain-900">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(ellipse at 50% 30%, #2D4A6B 0%, #0D1B2A 70%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-1/2 opacity-20"
          style={{
            background:
              "linear-gradient(to top, #A8C8E8, transparent)",
          }}
        />
        {/* Mountain silhouette */}
        <svg
          className="absolute bottom-0 left-0 right-0 opacity-20"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#1A2744"
            d="M0,160 L180,96 L360,224 L540,128 L720,192 L900,80 L1080,160 L1260,64 L1440,128 L1440,320 L0,320 Z"
          />
          <path
            fill="#0D1B2A"
            d="M0,256 L200,192 L400,288 L600,208 L800,272 L1000,176 L1200,240 L1440,192 L1440,320 L0,320 Z"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xs md:text-sm uppercase tracking-[0.3em] text-peak-gold-light mb-6"
        >
          MUZHOU GLOVES
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-4xl md:text-6xl lg:text-7xl font-serif text-white tracking-wide leading-tight mb-6"
        >
          {t("title")}
          <br />
          {t("subtitle")}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-white/70 text-sm md:text-base mb-12 tracking-wide"
        >
          {t("description")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            href={`/${locale}/products`}
            className="px-8 py-3 text-sm font-medium bg-white text-mountain-900 hover:bg-glacier-200 transition-colors tracking-wide"
          >
            {t("ctaProducts")}
          </Link>
          <Link
            href={`/${locale}/inquiry`}
            className="px-8 py-3 text-sm font-medium border border-white/30 text-white hover:bg-white/10 transition-colors tracking-wide"
          >
            {t("ctaInquiry")}
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 5v14M5 12l7 7 7-7" />
        </svg>
      </motion.div>
    </section>
  );
}
