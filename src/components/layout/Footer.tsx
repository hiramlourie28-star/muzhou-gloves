import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";

export default function Footer() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <footer className="bg-mountain-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Company info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-peak-gold flex items-center justify-center text-mountain-900 font-serif text-sm font-bold">
                MZ
              </div>
              <span className="font-serif text-lg tracking-wide">
                牧洲手套
              </span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              {t("footer.tagline")}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white/60 text-xs uppercase tracking-widest mb-4">
              NAVIGATION
            </h4>
            <div className="flex flex-col gap-2">
              {[
                { href: "", label: t("nav.home") },
                { href: "/products", label: t("nav.products") },
                { href: "/about", label: t("nav.about") },
                { href: "/contact", label: t("nav.contact") },
                { href: "/inquiry", label: t("nav.inquiry") },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={`/${locale}${link.href}`}
                  className="text-white/60 hover:text-peak-gold-light text-sm transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white/60 text-xs uppercase tracking-widest mb-4">
              CONTACT
            </h4>
            <div className="flex flex-col gap-2 text-white/60 text-sm">
              <p>{t("contact.address")}</p>
              <p className="text-white/80 font-medium">{t("contact.phone")}</p>
              <p>{t("contact.contact_person")}</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-white/50 text-xs">
          <p>
            &copy; {new Date().getFullYear()} {t("footer.company")}. {t("footer.rights")}.
          </p>
          <p>
            {t("contact.address")}
          </p>
        </div>
      </div>
    </footer>
  );
}
