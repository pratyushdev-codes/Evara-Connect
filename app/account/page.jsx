"use client";

import { useState } from "react";
import {
  BadgeCheck,
  Car,
  ChevronRight,
  DoorOpen,
  FileText,
  LifeBuoy,
  MessageSquareWarning,
  Phone,
  RotateCcw,
  ShoppingBasket,
  Users,
  Wrench,
} from "lucide-react";
import { RESIDENT } from "@/lib/data";
import { STORAGE_KEYS, fmtStamp, inr, useStore } from "@/lib/store";
import PaySheet from "@/components/PaySheet";
import { SectionTitle, Skeleton, StatusPill } from "@/components/ui";

const LINKS = [
  { icon: Users, label: "Household members", value: "3 members" },
  { icon: Car, label: "My vehicles", value: "GJ-01-HJ-4521" },
  { icon: FileText, label: "Documents & NOC", value: "Receipts, share certificate" },
  { icon: LifeBuoy, label: "Helpdesk & emergency", value: "Security · 080-4521-9000" },
];

export default function AccountPage() {
  const [requests] = useStore("gp_requests", []);
  const [complaints] = useStore("gp_complaints", []);
  const [passes] = useStore("gp_passes", []);
  const [orders, , ordersReady] = useStore("gp_orders", []);
  const [duesPaid, setDuesPaid] = useStore("gp_dues_paid", false);

  const [payOpen, setPayOpen] = useState(false);

  const stats = [
    { icon: Wrench, label: "Bookings", value: requests.length },
    { icon: MessageSquareWarning, label: "Tickets", value: complaints.length },
    { icon: DoorOpen, label: "Passes", value: passes.length },
    { icon: ShoppingBasket, label: "Orders", value: orders.length },
  ];

  const resetDemo = () => {
    if (!window.confirm("Reset all demo data? Bookings, tickets, passes and orders will be cleared.")) return;
    try {
      STORAGE_KEYS.forEach((k) => window.localStorage.removeItem(k));
    } catch {
      /* ignore */
    }
    window.location.reload();
  };

  return (
    <div className="px-5 pt-7">
      <p className="text-[10.5px] font-bold uppercase tracking-[0.24em] text-gold-700">
        Golden Park · My unit
      </p>
      <h1 className="mt-1 font-display text-[28px] font-medium leading-tight text-ink">
        Account
      </h1>

      {/* Profile card */}
      <div className="mt-5 overflow-hidden rounded-3xl border border-line bg-white shadow-card">
        <div className="flex items-center gap-4 bg-gradient-to-br from-espresso-900 via-espresso-900 to-espresso-800 p-5">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-b from-gold-400 to-gold-600 font-display text-xl font-semibold text-espresso-900 shadow-goldglow">
            {RESIDENT.initials}
          </span>
          <div className="min-w-0">
            <p className="truncate font-display text-[19px] font-medium text-gold-50">
              {RESIDENT.name}
            </p>
            <p className="text-[12.5px] text-gold-200/80">
              Flat {RESIDENT.flat} · {RESIDENT.tower}
            </p>
          </div>
          <span className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-full border border-gold-500/40 bg-gold-500/15 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wider text-gold-300">
            <BadgeCheck size={12} /> {RESIDENT.role}
          </span>
        </div>
        <div className="flex items-center justify-between px-5 py-3.5">
          <p className="flex items-center gap-1.5 text-[12.5px] text-ink-soft">
            <Phone size={13} className="text-gold-600" /> {RESIDENT.phone}
          </p>
          <p className="text-[12px] text-ink-mute">Resident since {RESIDENT.since}</p>
        </div>
      </div>

      {/* Dues */}
      <div className="mt-4 flex items-center justify-between rounded-3xl border border-line bg-white p-4 shadow-card">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold-700">
            Society dues · {RESIDENT.duesPeriod}
          </p>
          <p className="mt-1 font-display text-[22px] font-semibold text-ink">
            {duesPaid ? "All cleared" : inr(RESIDENT.dues)}
          </p>
        </div>
        {duesPaid ? (
          <StatusPill status="Paid" />
        ) : (
          <button
            onClick={() => setPayOpen(true)}
            className="rounded-full bg-gradient-to-b from-gold-400 to-gold-600 px-4 py-2.5 text-[13px] font-bold text-espresso-900 shadow-goldglow transition active:scale-95"
          >
            Pay now
          </button>
        )}
      </div>

      {/* Activity stats */}
      <div className="mt-4 grid grid-cols-4 gap-2.5">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-3xl border border-line bg-white px-2 py-3.5 text-center shadow-card"
          >
            <s.icon size={17} className="mx-auto text-gold-600" />
            <p className="mt-1.5 font-display text-[19px] font-semibold text-ink">{s.value}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-ink-mute">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="mt-7">
        <SectionTitle eyebrow="Society market" title="Recent orders" />
        <div className="mt-4 space-y-3">
          {!ordersReady ? (
            <Skeleton className="h-20" />
          ) : orders.length === 0 ? (
            <p className="rounded-3xl border border-dashed border-line bg-white/60 px-5 py-5 text-center text-[13px] text-ink-mute">
              Nothing ordered yet — the plaza store delivers in minutes.
            </p>
          ) : (
            orders.slice(0, 3).map((o) => (
              <div
                key={o.id}
                className="flex items-center gap-3 rounded-3xl border border-line bg-white p-4 shadow-card"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gold-50 text-gold-700 ring-1 ring-gold-100">
                  <ShoppingBasket size={19} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-semibold text-ink">
                    {o.items.length} item{o.items.length > 1 ? "s" : ""} · {inr(o.total)}
                  </p>
                  <p className="text-[11.5px] text-ink-mute">
                    {o.id} · {fmtStamp(o.createdAt)}
                  </p>
                </div>
                <StatusPill status={o.status} />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Links */}
      <div className="mt-7 overflow-hidden rounded-3xl border border-line bg-white shadow-card">
        {LINKS.map((l, i) => (
          <button
            key={l.label}
            className={`flex w-full items-center gap-3.5 px-4 py-4 text-left transition active:bg-cream/70 ${
              i ? "border-t border-line" : ""
            }`}
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold-50 text-gold-700 ring-1 ring-gold-100">
              <l.icon size={17} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[14px] font-semibold text-ink">{l.label}</span>
              <span className="block truncate text-[12px] text-ink-mute">{l.value}</span>
            </span>
            <ChevronRight size={17} className="shrink-0 text-ink-mute" />
          </button>
        ))}
      </div>

      {/* Reset demo */}
      <button
        onClick={resetDemo}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-line bg-white py-3.5 text-[13.5px] font-semibold text-ink-soft transition active:scale-[0.98]"
      >
        <RotateCcw size={15} className="text-gold-600" />
        Reset demo data
      </button>
      <p className="mb-2 mt-3 text-center text-[11px] leading-relaxed text-ink-mute">
        Golden Park Residences · demo build — everything is stored locally in your browser.
      </p>

      <PaySheet
        open={payOpen}
        onClose={() => setPayOpen(false)}
        paid={duesPaid}
        onPaid={() => setDuesPaid(true)}
      />
    </div>
  );
}
