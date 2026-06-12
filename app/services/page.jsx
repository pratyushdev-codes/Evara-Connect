"use client";

import { useState } from "react";
import {
  Bug,
  CheckCircle2,
  Clock,
  Droplets,
  Hammer,
  PaintRoller,
  Plug,
  Snowflake,
  Sparkles,
  Star,
  Wrench,
  Zap,
} from "lucide-react";
import { SERVICES, SERVICE_SLOTS, TECHNICIANS, RESIDENT } from "@/lib/data";
import { fmtDate, todayISO, uid, useStore } from "@/lib/store";
import Sheet from "@/components/Sheet";
import { Button, Chip, Empty, SectionTitle, Skeleton, StatusPill, inputCls } from "@/components/ui";

const SERVICE_ICONS = {
  electrician: Zap,
  plumber: Droplets,
  ac: Snowflake,
  carpenter: Hammer,
  painter: PaintRoller,
  pest: Bug,
  cleaning: Sparkles,
  appliance: Plug,
};

export default function ServicesPage() {
  const [requests, setRequests, ready] = useStore("gp_requests", []);

  const [selected, setSelected] = useState(null); // service being booked
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState(todayISO());
  const [slot, setSlot] = useState(null);
  const [urgent, setUrgent] = useState(false);
  const [placed, setPlaced] = useState(null); // success view

  const openFor = (s) => {
    setSelected(s);
    setDesc("");
    setDate(todayISO());
    setSlot(null);
    setUrgent(false);
    setPlaced(null);
  };

  const closeSheet = () => {
    setSelected(null);
    setPlaced(null);
  };

  const confirm = () => {
    const req = {
      id: uid("SR"),
      serviceId: selected.id,
      service: selected.label,
      desc: desc.trim(),
      date,
      slot: urgent ? "Within 60 min" : slot,
      urgent,
      tech: TECHNICIANS[Math.floor(Math.random() * TECHNICIANS.length)],
      rating: (4.6 + Math.random() * 0.3).toFixed(1),
      status: "Confirmed",
      createdAt: Date.now(),
    };
    setRequests((prev) => [req, ...prev]);
    setPlaced(req);
  };

  const cancel = (id) =>
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Cancelled" } : r))
    );

  const canConfirm = urgent || slot;

  return (
    <div className="px-5 pt-7">
      <p className="text-[10.5px] font-bold uppercase tracking-[0.24em] text-gold-700">
        Golden Park · Home services
      </p>
      <h1 className="mt-1 font-display text-[28px] font-medium leading-tight text-ink">
        A specialist at your door
      </h1>
      <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-mute">
        Verified partners for {RESIDENT.flat}. Visit charges start at ₹99 and are added to your
        monthly bill.
      </p>

      {/* Catalog */}
      <div className="mt-5 grid grid-cols-2 gap-3">
        {SERVICES.map((s) => {
          const Icon = SERVICE_ICONS[s.id] || Wrench;
          return (
            <button
              key={s.id}
              onClick={() => openFor(s)}
              className="group rounded-3xl border border-line bg-white p-4 text-left shadow-card transition active:scale-[0.97]"
            >
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gold-50 text-gold-700 ring-1 ring-gold-100 transition group-active:scale-90">
                <Icon size={22} />
              </span>
              <p className="mt-3 text-[15px] font-semibold text-ink">{s.label}</p>
              <p className="mt-0.5 text-[12px] leading-snug text-ink-mute">{s.desc}</p>
              <p className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-gold-700">
                <Clock size={12} /> {s.eta}
              </p>
            </button>
          );
        })}
      </div>

      {/* My bookings */}
      <div className="mt-8 pb-2">
        <SectionTitle eyebrow="Your requests" title="My bookings" />
        <div className="mt-3 space-y-3">
          {!ready ? (
            <Skeleton className="h-[92px]" />
          ) : requests.length === 0 ? (
            <Empty
              icon={Wrench}
              title="No bookings yet"
              body="Pick a service above — a verified technician will be assigned in seconds."
            />
          ) : (
            requests.map((r) => {
              const Icon = SERVICE_ICONS[r.serviceId] || Wrench;
              return (
                <div
                  key={r.id}
                  className="rounded-3xl border border-line bg-white p-4 shadow-card"
                >
                  <div className="flex items-start gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gold-50 text-gold-700 ring-1 ring-gold-100">
                      <Icon size={20} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-[15px] font-semibold text-ink">{r.service}</p>
                        <StatusPill status={r.status} />
                      </div>
                      <p className="mt-0.5 text-[12.5px] text-ink-mute">
                        {fmtDate(r.date)} · {r.slot}
                        {r.urgent ? " · ⚡ emergency" : ""}
                      </p>
                      {r.desc && (
                        <p className="mt-1 line-clamp-1 text-[12.5px] italic text-ink-soft">
                          “{r.desc}”
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-line/70 pt-3">
                    <p className="text-[12px] text-ink-mute">
                      <span className="font-semibold text-ink-soft">{r.tech}</span> · ★ {r.rating}{" "}
                      · {r.id}
                    </p>
                    {r.status === "Confirmed" && (
                      <button
                        onClick={() => cancel(r.id)}
                        className="text-[12.5px] font-bold text-ink-mute underline-offset-2 hover:underline"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Booking sheet */}
      <Sheet
        open={!!selected}
        onClose={closeSheet}
        title={placed ? "Visit booked" : selected ? `Book ${selected.label}` : ""}
      >
        {placed ? (
          <div className="flex flex-col items-center px-1 pb-1 pt-3 text-center">
            <span className="grid h-16 w-16 animate-pop place-items-center rounded-full bg-gold-50 ring-1 ring-gold-200">
              <CheckCircle2 size={34} className="text-gold-600" />
            </span>
            <h4 className="mt-4 font-display text-2xl text-ink">You're all set</h4>
            <p className="mt-1 text-sm text-ink-soft">
              {placed.service} · {fmtDate(placed.date)} · {placed.slot}
            </p>
            <div className="mt-5 w-full rounded-3xl border border-line bg-cream/60 p-4 text-left">
              <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-gold-700">
                Technician assigned
              </p>
              <div className="mt-2.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-b from-gold-400 to-gold-600 font-display text-[14px] font-semibold text-espresso-900">
                    {placed.tech.slice(0, 1)}
                  </span>
                  <div>
                    <p className="text-[14.5px] font-semibold text-ink">{placed.tech}</p>
                    <p className="text-[11.5px] text-ink-mute">Golden Park verified partner</p>
                  </div>
                </div>
                <span className="flex items-center gap-1 rounded-full border border-gold-200 bg-gold-50 px-2.5 py-1 text-[12px] font-bold text-gold-800">
                  <Star size={12} className="fill-gold-500 text-gold-600" /> {placed.rating}
                </span>
              </div>
            </div>
            <p className="mt-3 text-[12px] text-ink-mute">
              Booking {placed.id} · we'll notify you 15 minutes before arrival.
            </p>
            <Button className="mt-5 w-full" onClick={closeSheet}>
              Done
            </Button>
          </div>
        ) : selected ? (
          <div className="space-y-5">
            <div className="flex items-center gap-3 rounded-3xl border border-line bg-cream/60 p-3.5">
              {(() => {
                const Icon = SERVICE_ICONS[selected.id] || Wrench;
                return (
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-gold-700 ring-1 ring-gold-100">
                    <Icon size={20} />
                  </span>
                );
              })()}
              <div>
                <p className="text-[15px] font-semibold text-ink">{selected.label}</p>
                <p className="text-[12px] text-ink-mute">
                  {selected.desc} · typical response {selected.eta.toLowerCase()}
                </p>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[12.5px] font-bold text-ink-soft">
                What needs fixing?
              </label>
              <textarea
                rows={3}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="e.g. Bedroom AC is cooling poorly and dripping water…"
                className={inputCls + " resize-none"}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[12.5px] font-bold text-ink-soft">
                Preferred date
              </label>
              <input
                type="date"
                min={todayISO()}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={inputCls}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[12.5px] font-bold text-ink-soft">
                Time slot
              </label>
              <div className="flex flex-wrap gap-2">
                {SERVICE_SLOTS.map((s) => (
                  <Chip
                    key={s}
                    selected={!urgent && slot === s}
                    onClick={() => {
                      setSlot(s);
                      setUrgent(false);
                    }}
                  >
                    {s}
                  </Chip>
                ))}
                <Chip selected={urgent} onClick={() => setUrgent((u) => !u)}>
                  ⚡ Emergency · 60 min
                </Chip>
              </div>
            </div>

            <Button className="w-full" disabled={!canConfirm} onClick={confirm}>
              Confirm booking
            </Button>
            <p className="-mt-2 text-center text-[11.5px] text-ink-mute">
              Visiting {RESIDENT.tower} · {RESIDENT.flat}. Free cancellation up to 1 hour before.
            </p>
          </div>
        ) : null}
      </Sheet>
    </div>
  );
}
