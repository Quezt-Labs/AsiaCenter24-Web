"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const Footer = () => {
  const t = useTranslations();
  const currentYear = new Date().getFullYear();
  const { ref, isInView } = useScrollReveal(0.1);

  const footerLinks = {
    company: [
      { label: t("aboutUs"), href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Blog", href: "/blog" },
      { label: "Press", href: "/press" },
    ],
    support: [
      { label: t("helpSupport"), href: "/help" },
      { label: t("contactUs"), href: "/contact" },
      { label: "FAQs", href: "/faqs" },
      { label: "Shipping Info", href: "/shipping" },
    ],
    legal: [
      { label: t("privacyPolicy"), href: "/privacy" },
      { label: t("termsConditions"), href: "/terms" },
      { label: "Refund Policy", href: "/refund" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
  ];

  return (
    <footer ref={ref} className="bg-secondary/40 border-t border-border/50">
      {/* Newsletter Section */}
      <div className="gradient-hero relative overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -right-20 w-60 h-60 bg-background/5 rounded-full"
        />
        <div className="container-app py-8 sm:py-10 text-center relative z-10">
          <h3 className="text-xl sm:text-2xl font-bold text-primary-foreground mb-2">
            {t("newsletter")}
          </h3>
          <p className="text-primary-foreground/80 mb-5 max-w-md mx-auto text-sm">
            {t("newsletterDesc")}
          </p>
          <form className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-full bg-background/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none focus:border-primary-foreground/40 text-sm transition-colors"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="px-6 py-3 rounded-full bg-background text-primary font-semibold hover:bg-background/90 transition-colors text-sm shadow-lg"
            >
              {t("subscribe")}
            </motion.button>
          </form>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-app py-10 sm:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl gradient-hero flex items-center justify-center">
                <span className="text-lg">🛒</span>
              </div>
              <span className="text-lg font-bold text-foreground">
                Fresh<span className="text-primary">Mart</span>
              </span>
            </Link>
            <p className="text-muted-foreground mb-5 max-w-sm text-sm leading-relaxed">
              Your trusted partner for fresh groceries and daily essentials.
              Quality products delivered to your doorstep.
            </p>
            <div className="space-y-2.5 text-muted-foreground">
              <div className="flex items-center gap-2.5">
                <MapPin size={15} className="text-primary shrink-0" />
                <span className="text-xs sm:text-sm">
                  123 Market Street, Mumbai 400001
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={15} className="text-primary shrink-0" />
                <span className="text-xs sm:text-sm">+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={15} className="text-primary shrink-0" />
                <span className="text-xs sm:text-sm">
                  support@freshmart.com
                </span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-3 text-sm">
              Company
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-xs sm:text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-3 text-sm">
              Support
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-xs sm:text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="hidden lg:block">
            <h4 className="font-semibold text-foreground mb-3 text-sm">
              Legal
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-xs sm:text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-muted-foreground text-xs">
            © {currentYear} FreshMart. {t("allRightsReserved")}.
          </p>
          <div className="flex items-center gap-2.5">
            {socialLinks.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -2, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-9 h-9 rounded-full bg-secondary/80 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label={social.label}
              >
                <social.icon size={16} />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
