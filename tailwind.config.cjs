/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./src/**/*.{js,ts,jsx,tsx}"],
  // Safelist classes that are generated dynamically or used in strings/templates
  // so the JIT always emits them.
  safelist: [
    // explicit utilities
    "bg-blue-500",
    "bg-blue-500/10",
    "bg-emerald-500/10",
    "bg-purple-500/10",
    "fill-amber-400",
    "fill-white",
    "from-blue-500/10",
    "from-emerald-500/10",
    "from-orange-500",
    "from-purple-500/10",
    "hover:bg-red-50",
    "hover:text-red-500",
    "text-amber-400",
    "text-blue-600",
    "text-emerald-600",
    "text-purple-600",
    "text-white",
    "to-amber-500",
    "to-blue-500/5",
    "to-emerald-500/5",
    "to-primary-dark",
    "to-purple-500/5",
    "translate-x-[-100%]",
    "group-hover:translate-x-[100%]",
    "via-white/20",
    // pattern-based (covers other numeric shades / variants)
    {
      pattern:
        /^(bg|text|from|to|via|fill)-(blue|emerald|purple|amber|red|primary)(-[0-9]+|\/[0-9]+|\/\[.*\])?$/,
    },
    { pattern: /^translate-x-\[.*\]$/ },
    { pattern: /^group-hover:translate-x-\[.*\]$/ },
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        card: "hsl(var(--card) / <alpha-value>)",
        "card-foreground": "hsl(var(--card-foreground) / <alpha-value>)",
        popover: "hsl(var(--popover) / <alpha-value>)",
        "popover-foreground": "hsl(var(--popover-foreground) / <alpha-value>)",
        primary: "hsl(var(--primary) / <alpha-value>)",
        "primary-foreground": "hsl(var(--primary-foreground) / <alpha-value>)",
        secondary: "hsl(var(--secondary) / <alpha-value>)",
        "secondary-foreground":
          "hsl(var(--secondary-foreground) / <alpha-value>)",
        muted: "hsl(var(--muted) / <alpha-value>)",
        "muted-foreground": "hsl(var(--muted-foreground) / <alpha-value>)",
        accent: "hsl(var(--accent) / <alpha-value>)",
        "accent-foreground": "hsl(var(--accent-foreground) / <alpha-value>)",
        destructive: "hsl(var(--destructive) / <alpha-value>)",
        success: "hsl(var(--success) / <alpha-value>)",
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
      },
    },
  },
  plugins: [],
};
