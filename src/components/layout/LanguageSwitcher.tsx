import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

interface LanguageSwitcherProps {
  compact?: boolean;
}

const LanguageSwitcher = ({ compact = false }: LanguageSwitcherProps) => {
  const { i18n } = useTranslation();

  const languages = [
    { code: "en", label: "English", shortLabel: "EN" },
    { code: "hi", label: "हिंदी", shortLabel: "हि" },
  ];

  const currentLang =
    languages.find((lang) => lang.code === i18n.language) || languages[0];

  const toggleLanguage = () => {
    const nextLang = i18n.language === "en" ? "hi" : "en";
    i18n.changeLanguage(nextLang);
  };

  if (compact) {
    return (
      <button
        onClick={toggleLanguage}
        className="flex items-center gap-1 p-2 text-foreground hover:text-primary transition-colors"
        aria-label="Switch language"
      >
        <Globe size={18} />
        <span className="text-xs font-medium">{currentLang.shortLabel}</span>
      </button>
    );
  }

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      aria-label="Switch language"
    >
      <Globe size={16} />
      <span className="text-sm">{currentLang.label}</span>
    </button>
  );
};

export default LanguageSwitcher;
