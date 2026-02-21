"use client";

import {
  useState,
  useEffect,
  useMemo,
  useId,
  useCallback,
  startTransition,
} from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, Heart, User, Menu, X } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useLogout } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import LanguageSwitcher from "../layout/LanguageSwitcher";

const HeaderClient = () => {
  const { t } = useTranslation();
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const mobileNavId = useId();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Subscribe to primitive values to avoid unnecessary re-renders
  const cartItemCount = useCartStore((state) => state.items.length);
  const wishlistItemCount = useWishlistStore((state) => state.items.length);
  const { isAuthenticated, user, openAuthModal } = useAuthStore();
  const logoutMutation = useLogout();

  useEffect(() => {
    // Use passive listener and rAF to avoid scroll jank
    let rafId: number | null = null;
    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 10);
        rafId = null;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleAccountClick = useCallback(() => {
    if (!isAuthenticated) openAuthModal();
  }, [isAuthenticated, openAuthModal]);

  const toggleMobileMenu = useCallback(
    () => setIsMobileMenuOpen((v) => !v),
    [],
  );

  const handleNavClick = useCallback(
    (href: string, e?: React.MouseEvent<HTMLAnchorElement>) => {
      e?.preventDefault();
      setIsMobileMenuOpen(false);
      startTransition(() => {
        router.push(href);
      });
    },
    [router],
  );

  const navLinks = useMemo(
    () => [
      { href: "/", label: t("home") },
      { href: "/products", label: t("products") },
      { href: "/offers", label: t("offers") },
    ],
    [t],
  );

  return (
    <header
      className={cn(
        "header-sticky transition-all duration-300",
        isScrolled
          ? "shadow-md backdrop-blur-xl bg-background/90"
          : "bg-background",
      )}
    >
      <div className="container-app">
        {/* Top Bar - Desktop */}
        <div className="hidden lg:flex items-center justify-between py-2 text-xs border-b border-border/40">
          <p className="text-muted-foreground">
            Free delivery on orders above ₹499 🚚
          </p>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <span className="text-border">|</span>
            <a
              href="tel:+919876543210"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              📞 +91 98765 43210
            </a>
          </div>
        </div>

        {/* Main Header */}
        <div className="flex items-center justify-between py-3 lg:py-3.5 gap-3 sm:gap-4">
          {/* Mobile Menu Toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
            aria-controls={mobileNavId}
            className="lg:hidden p-2 -ml-2 text-foreground rounded-xl hover:bg-secondary/60 transition-colors"
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X size={22} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu size={22} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <motion.div
              whileHover={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.5 }}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl gradient-hero flex items-center justify-center shadow-sm"
            >
              <span className="text-lg sm:text-xl">🛒</span>
            </motion.div>
            <span className="text-lg sm:text-xl font-bold text-foreground hidden sm:block">
              Asia<span className="text-[#bcbe4b]">Center24</span>
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-8">
            <div className="search-bar w-full group">
              <Search className="w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder={t("search")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-sm"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(link.href, e)}
                className={cn(
                  "relative px-3 py-2 text-base font-medium capitalize transition-colors rounded-lg",
                  pathname === link.href
                    ? "text-primary bg-primary/5"
                    : "text-foreground hover:text-primary hover:bg-primary/5",
                )}
              >
                {link.label}
                {pathname === link.href && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0.5 left-3 right-3 h-0.5 bg-primary rounded-full"
                    transition={{
                      type: "spring" as const,
                      damping: 25,
                      stiffness: 300,
                    }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {/* Search - Mobile */}
            <Link
              href="/search"
              className="lg:hidden p-2 text-foreground hover:text-primary rounded-xl hover:bg-secondary/60 transition-all"
            >
              <Search size={20} />
            </Link>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative p-2 text-foreground hover:text-primary rounded-xl hover:bg-secondary/60 transition-all"
              aria-label={t("wishlist")}
            >
              <Heart size={20} />
              {wishlistItemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 min-w-[18px] rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center"
                >
                  {wishlistItemCount}
                </motion.span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 text-foreground hover:text-primary rounded-xl hover:bg-secondary/60 transition-all"
              aria-label={t("cart")}
            >
              <ShoppingCart size={20} />
              {cartItemCount > 0 && (
                <motion.span
                  key={cartItemCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring" as const,
                    damping: 15,
                    stiffness: 400,
                  }}
                  className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-accent text-accent-foreground text-[10px] font-bold flex items-center justify-center px-1"
                >
                  {cartItemCount}
                </motion.span>
              )}
            </Link>

            {/* Account */}
            {isAuthenticated ? (
              <div className="flex items-center relative group">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 p-2 text-foreground hover:text-primary rounded-xl hover:bg-secondary/60 transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                    <User size={15} className="text-primary" />
                  </div>
                  <span className="hidden md:block text-sm font-medium max-w-[80px] truncate">
                    {user?.name || `+91 ${user?.phone?.slice(-4)}`}
                  </span>
                </Link>
                {/* Dropdown */}
                <div className="hidden sm:block absolute top-full right-0 mt-1 w-48 bg-background border border-border/50 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
                  <div className="py-1.5">
                    <Link
                      href="/profile"
                      className="block px-4 py-2.5 text-sm text-foreground hover:bg-secondary/60 transition-colors"
                    >
                      {t("profile")}
                    </Link>
                    <Link
                      href="/my-orders"
                      className="block px-4 py-2.5 text-sm text-foreground hover:bg-secondary/60 transition-colors"
                    >
                      {t("myOrders")}
                    </Link>
                    <div className="border-t border-border/50 my-1" />
                    <button
                      onClick={() => logoutMutation.mutate()}
                      disabled={logoutMutation.isPending}
                      className="w-full text-left px-4 py-2.5 text-sm text-destructive hover:bg-destructive/5 transition-colors disabled:opacity-50"
                    >
                      {logoutMutation.isPending ? "..." : t("logout")}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleAccountClick}
                className="flex items-center gap-2 p-2 text-foreground hover:text-primary rounded-xl hover:bg-secondary/60 transition-all"
              >
                <User size={20} />
                <span className="hidden md:block text-sm font-medium capitalize">
                  {t("login")}
                </span>
              </motion.button>
            )}

            {/* Mobile Language Switcher */}
            <div className="lg:hidden">
              <LanguageSwitcher compact />
            </div>
          </div>
        </div>

        {/* Search Bar - Mobile */}
        <div className="lg:hidden pb-3">
          <div className="search-bar">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={t("search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-sm"
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 top-[var(--header-height)] bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              id="mobile-nav"
              role="navigation"
              className="lg:hidden bg-background border-t border-border/50 relative z-50 overflow-hidden"
            >
              <nav className="container-app py-3 space-y-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "block py-3 px-4 rounded-xl text-base font-medium capitalize transition-all active:scale-[0.98]",
                        pathname === link.href
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-secondary/60",
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                <div className="border-t border-border/50 my-2 pt-2">
                  {isAuthenticated ? (
                    <>
                      <Link
                        href="/profile"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 py-3 px-4 rounded-xl text-base font-medium text-foreground hover:bg-secondary/60 transition-all active:scale-[0.98]"
                      >
                        <User size={18} />
                        {t("profile")}
                      </Link>
                      <Link
                        href="/my-orders"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 py-3 px-4 rounded-xl text-base font-medium text-foreground hover:bg-secondary/60 transition-all active:scale-[0.98]"
                      >
                        {t("myOrders")}
                      </Link>
                      <button
                        onClick={() => {
                          logoutMutation.mutate();
                          setIsMobileMenuOpen(false);
                        }}
                        disabled={logoutMutation.isPending}
                        className="flex items-center gap-3 py-3 px-4 rounded-xl text-base font-medium text-destructive hover:bg-destructive/5 transition-all w-full active:scale-[0.98] disabled:opacity-50"
                      >
                        {logoutMutation.isPending ? "..." : t("logout")}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        openAuthModal();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 py-3 px-4 rounded-xl text-base font-medium capitalize text-primary hover:bg-primary/5 transition-all w-full active:scale-[0.98]"
                    >
                      <User size={18} />
                      {t("login")}
                    </button>
                  )}
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default HeaderClient;
