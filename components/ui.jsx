"use client";

export const inputCls =
  "w-full rounded-2xl border border-line bg-cream/70 px-4 py-3 text-[15px] text-ink placeholder:text-ink-mute/70 transition focus:border-gold-400 focus:bg-white focus:ring-4 focus:ring-gold-100";

export function Button({ children, variant = "gold", className = "", ...props }) {
  const styles = {
    gold: "bg-gradient-to-b from-gold-400 to-gold-600 text-espresso-900 shadow-[inset_0_1px_0_rgba(255,255,255,.4)] shadow-goldglow",
    dark: "bg-espresso-900 text-gold-100",
    ghost: "border border-line bg-white text-ink",
    quiet: "bg-cream text-ink-soft",
  };
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-[15px] font-semibold tracking-wide transition active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40 ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function Chip({ selected, children, className = "", ...props }) {
  return (
    <button
      type="button"
      {...props}
      className={`rounded-full border px-3.5 py-2 text-[13px] font-semibold transition active:scale-95 ${
        selected
          ? "border-gold-500 bg-gold-50 text-gold-800 shadow-[inset_0_0_0_1px_#BC9440]"
          : "border-line bg-white text-ink-soft"
      } ${className}`}
    >
      {children}
    </button>
  );
}

export function SectionTitle({ eyebrow, title, action, className = "" }) {
  return (
    <div className={`flex items-end justify-between ${className}`}>
      <div>
        {eyebrow ? (
          <p className="text-[10.5px] font-bold uppercase tracking-[0.22em] text-gold-700">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-1 font-display text-[21px] font-medium leading-tight text-ink">
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}

const PILL_STYLES = {
  Confirmed: "border-gold-200 bg-gold-50 text-gold-800",
  Active: "border-gold-200 bg-gold-50 text-gold-800",
  "On the way": "border-gold-200 bg-gold-50 text-gold-800",
  Open: "border-amber-200 bg-amber-50 text-amber-700",
  Urgent: "border-red-200 bg-red-50 text-red-600",
  Resolved: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Delivered: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Paid: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Cancelled: "border-stone-200 bg-stone-100 text-stone-500",
  Revoked: "border-stone-200 bg-stone-100 text-stone-500",
  Expired: "border-stone-200 bg-stone-100 text-stone-500",
};

export function StatusPill({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold tracking-wide ${
        PILL_STYLES[status] || "border-line bg-cream text-ink-soft"
      }`}
    >
      {status}
    </span>
  );
}

export function Empty({ icon: Icon, title, body }) {
  return (
    <div className="rounded-3xl border border-dashed border-line bg-white/60 px-6 py-10 text-center">
      {Icon ? (
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-gold-50 text-gold-600 ring-1 ring-gold-100">
          <Icon size={22} />
        </span>
      ) : null}
      <p className="mt-3 font-display text-lg text-ink">{title}</p>
      <p className="mx-auto mt-1 max-w-[240px] text-[13px] leading-relaxed text-ink-mute">{body}</p>
    </div>
  );
}

export function Skeleton({ className = "" }) {
  return <div className={`animate-pulse rounded-3xl bg-line/50 ${className}`} />;
}
