"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState } from "react";
import { motion } from "framer-motion";

export default function ContactContent() {
  const t = useTranslations();
  const locale = useLocale();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = Object.fromEntries(new FormData(form).entries());
    console.log("Contact form:", data);
    setSubmitted(true);
    form.reset();
  };

  return (
    <div className="pt-24 pb-16">
      <section className="py-12 px-6 bg-mountain-800 text-white text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-peak-gold-light mb-4">
          {t("contact.subtitle")}
        </p>
        <h1 className="text-3xl md:text-5xl font-serif">{t("contact.title")}</h1>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {submitted ? (
              <div className="py-20 text-center">
                <p className="text-peak-gold font-serif text-xl mb-2">{t("contact.form.success")}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <input
                    name="name"
                    required
                    placeholder={t("contact.form.name")}
                    className="border-b border-alpine-400/40 bg-transparent px-0 py-3 text-sm text-mountain-800 placeholder:text-alpine-500 outline-none focus:border-mountain-800 transition-colors"
                  />
                  <input
                    name="company"
                    placeholder={t("contact.form.company")}
                    className="border-b border-alpine-400/40 bg-transparent px-0 py-3 text-sm text-mountain-800 placeholder:text-alpine-500 outline-none focus:border-mountain-800 transition-colors"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder={t("contact.form.email")}
                    className="border-b border-alpine-400/40 bg-transparent px-0 py-3 text-sm text-mountain-800 placeholder:text-alpine-500 outline-none focus:border-mountain-800 transition-colors"
                  />
                  <input
                    name="phone"
                    placeholder={t("contact.form.phone")}
                    className="border-b border-alpine-400/40 bg-transparent px-0 py-3 text-sm text-mountain-800 placeholder:text-alpine-500 outline-none focus:border-mountain-800 transition-colors"
                  />
                </div>
                <input
                  name="product"
                  placeholder={t("contact.form.product")}
                  className="border-b border-alpine-400/40 bg-transparent px-0 py-3 text-sm text-mountain-800 placeholder:text-alpine-500 outline-none focus:border-mountain-800 transition-colors"
                />
                <textarea
                  name="message"
                  rows={4}
                  placeholder={t("contact.form.message")}
                  className="border-b border-alpine-400/40 bg-transparent px-0 py-3 text-sm text-mountain-800 placeholder:text-alpine-500 outline-none focus:border-mountain-800 transition-colors resize-none"
                />
                <button
                  type="submit"
                  className="mt-4 px-8 py-3 text-sm font-medium bg-mountain-800 text-white hover:bg-mountain-700 transition-colors self-start"
                >
                  {t("contact.form.submit")}
                </button>
              </form>
            )}
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col gap-8 pt-4"
          >
            <div>
              <p className="text-xs uppercase tracking-widest text-alpine-400 mb-2">
                {t("contact.address_label")}
              </p>
              <p className="text-sm text-mountain-800 leading-relaxed">
                {t("contact.address")}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-alpine-400 mb-2">
                {t("contact.phone_label")}
              </p>
              <p className="text-sm text-mountain-800">{t("contact.phone")}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-alpine-400 mb-2">
                CONTACT PERSON
              </p>
              <p className="text-sm text-mountain-800">{t("contact.contact_person")}</p>
            </div>

            {/* WhatsApp link */}
            <a
              href="https://wa.me/8613566980150"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 px-6 py-3 text-sm font-medium border border-mountain-800 text-mountain-800 hover:bg-mountain-800 hover:text-white transition-colors self-start"
            >
              WhatsApp
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
