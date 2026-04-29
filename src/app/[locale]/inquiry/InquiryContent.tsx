"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { PRODUCT_CATEGORIES as categoryList } from "@/lib/supabase/types";
import { submitInquiry } from "../_actions/inquiry";

export default function InquiryContent() {
  const t = useTranslations();
  const locale = useLocale();
  const searchParams = useSearchParams();
  const presetProduct = searchParams.get("product") ?? "";
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(formData: FormData) {
    setError(null);
    formData.set("locale", locale);
    formData.set("source", "inquiry");
    startTransition(async () => {
      const res = await submitInquiry(formData);
      if (res.ok) setSubmitted(true);
      else setError(res.error ?? "提交失败，请稍后再试");
    });
  }

  return (
    <div className="pt-24 pb-16">
      <section className="py-12 px-6 bg-mountain-800 text-white text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-peak-gold-light mb-4">
          {t("inquiry.subtitle")}
        </p>
        <h1 className="text-3xl md:text-5xl font-serif">{t("inquiry.title")}</h1>
      </section>

      {submitted ? (
        <div className="max-w-lg mx-auto py-20 px-6 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-peak-gold font-serif text-xl"
          >
            {t("inquiry.form.success")}
          </motion.p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto px-6 py-20"
        >
          <form action={onSubmit} className="flex flex-col gap-5">
            {presetProduct && (
              <input type="hidden" name="referredProduct" value={presetProduct} />
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <input name="name" required placeholder={t("inquiry.form.name")}
                className="border-b border-alpine-400/40 bg-transparent px-0 py-3 text-sm text-mountain-800 placeholder:text-alpine-500 outline-none focus:border-mountain-800 transition-colors" />
              <input name="company" placeholder={t("inquiry.form.company")}
                className="border-b border-alpine-400/40 bg-transparent px-0 py-3 text-sm text-mountain-800 placeholder:text-alpine-500 outline-none focus:border-mountain-800 transition-colors" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <input name="email" type="email" required placeholder={t("inquiry.form.email")}
                className="border-b border-alpine-400/40 bg-transparent px-0 py-3 text-sm text-mountain-800 placeholder:text-alpine-500 outline-none focus:border-mountain-800 transition-colors" />
              <input name="phone" placeholder={t("inquiry.form.phone")}
                className="border-b border-alpine-400/40 bg-transparent px-0 py-3 text-sm text-mountain-800 placeholder:text-alpine-500 outline-none focus:border-mountain-800 transition-colors" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <select name="productType"
                className="border-b border-alpine-400/40 bg-transparent px-0 py-3 text-sm text-mountain-800 outline-none focus:border-mountain-800 transition-colors text-alpine-400">
                <option value="">{t("inquiry.form.productType")}</option>
                {categoryList.map((cat) => (
                  <option key={cat} value={cat}>{t(`categories.${cat}`)}</option>
                ))}
              </select>
              <input name="quantity" placeholder={t("inquiry.form.quantity")}
                className="border-b border-alpine-400/40 bg-transparent px-0 py-3 text-sm text-mountain-800 placeholder:text-alpine-500 outline-none focus:border-mountain-800 transition-colors" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <input name="size" placeholder={t("inquiry.form.size")}
                className="border-b border-alpine-400/40 bg-transparent px-0 py-3 text-sm text-mountain-800 placeholder:text-alpine-500 outline-none focus:border-mountain-800 transition-colors" />
              <input name="material" placeholder={t("inquiry.form.material")}
                className="border-b border-alpine-400/40 bg-transparent px-0 py-3 text-sm text-mountain-800 placeholder:text-alpine-500 outline-none focus:border-mountain-800 transition-colors" />
            </div>
            <textarea name="custom" rows={3} placeholder={t("inquiry.form.custom")}
              className="border-b border-alpine-400/40 bg-transparent px-0 py-3 text-sm text-mountain-800 placeholder:text-alpine-500 outline-none focus:border-mountain-800 transition-colors resize-none" />
            <textarea name="message" rows={2} placeholder={t("inquiry.form.message")}
              className="border-b border-alpine-400/40 bg-transparent px-0 py-3 text-sm text-mountain-800 placeholder:text-alpine-500 outline-none focus:border-mountain-800 transition-colors resize-none" />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button type="submit" disabled={pending}
              className="mt-6 px-8 py-3 text-sm font-medium bg-mountain-800 text-white hover:bg-mountain-700 disabled:opacity-50 transition-colors self-start">
              {pending ? "..." : t("inquiry.form.submit")}
            </button>
          </form>
        </motion.div>
      )}
    </div>
  );
}
