// This file exists only to ensure Tailwind's JIT generates utilities
// that are constructed dynamically or appear only in runtime strings.
// It is safe to keep — it won't be imported at runtime.
export default function _TailwindSafelist() {
  return (
    <div
      className={
        "bg-blue-500 bg-blue-500/10 bg-emerald-500/10 bg-purple-500/10 " +
        "fill-amber-400 fill-white " +
        "from-blue-500/10 from-emerald-500/10 from-orange-500 from-purple-500/10 " +
        "hover:bg-red-50 hover:text-red-500 " +
        "text-amber-400 text-blue-600 text-emerald-600 text-purple-600 text-white " +
        "to-amber-500 to-blue-500/5 to-emerald-500/5 to-primary-dark to-purple-500/5 " +
        "translate-x-[-100%] group-hover:translate-x-[100%] via-white/20"
      }
      style={{ display: "none" }}
    />
  );
}
