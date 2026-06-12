"use client";

import { useState } from "react";
import {
  BellRing,
  Briefcase,
  CarTaxiFront,
  CheckCircle2,
  DoorOpen,
  Package,
  QrCode,
  ShieldCheck,
  UserRound,
  UtensilsCrossed,
} from "lucide-react";
import { ARRIVALS_SEED, PASS_SEED, PASS_VALIDITY, RESIDENT, VISITOR_TYPES } from "@/lib/data";
import { fmtDate, makePassFromArrival, otp6, todayISO, uid, useStore } from "@/lib/store";
import Sheet from "@/components/Sheet";
import { Button, Chip, Empty, SectionTitle, Skeleton, StatusPill, inputCls } from "@/components/ui";

const ARRIVAL_ICONS = { food: UtensilsCrossed, guest: UserRound, package: Package };
const TYPE_ICONS = { Guest: UserRound, Delivery: Package, Cab: CarTaxiFront, Staff: Briefcase };

export default function GatePassPage() {
  const [arrivals, setArrivals, arrReady] = useStore("gp_arrivals", ARRIVALS_SEED);
  const [passes, setPasses, passReady] = useStore("gp_passes", PASS_SEED);

  const [tab, setTab] = useState("approvals");
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState("Guest");
  const [date, setDate] = useState(todayISO());
  const [validity, setValidity] = useState("2 hours");
  const [note, setNote] = useState("");
  const [created, setCreated] = useState(null);
  const [notice, setNotice] = useState(null);

  const flash = (msg) => {
    setNotice(msg);
    window.setTimeout(() => setNotice(null), 3200);
  };

  const approve = (a) => {
    setPasses((p) => [makePassFromArrival(a), ...p]);
    setArrivals((prev) => prev.filter((x) => x.id !== a.id));
    flash(`${a.name} approved — entry code sent to the gate`);
  };

  const deny = (a) => {
    setArrivals((prev) => prev.filter((x) => x.id !== a.id));
    flash(`${a.name} was turned away at the gate`);
  };

  const openSheet = () => {
    setName("");
    setType("Guest");
    setDate(todayISO());
    setValidity("2 hours");
    setNote("");
    setCreated(null);
    setOpen(true);
  };

  const closeSheet = () => {
    setOpen(false);
    setCreated(null);
  };

  const createPass = () => {
    const pass = {
      id: uid("PS"),
      code: otp6(),
      name: name.trim(),
      type,
      date,
      validity,
      note: note.trim(),
      status: "Active",
      createdAt: Date.now(),
    };
    setPasses((prev) => [pass, ...prev]);
    setCreated(pass);
  };

  const revoke = (id) =>
    setPasses((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "Revoked" } : p))
    );

  const canCreate = name.trim().length > 1;

  return (
    <div className="px-5 pt-7">
      {/* Toast */}
      {notice && (
        <div className="pointer-events-none fixed inset-x-0 top-3 z-[60]">
          <div className="mx-auto max-w-md px-5">
            <div className="flex animate-rise items-center gap-2 rounded-2xl border border-gold-700/40 bg-espresso-900 px-4 py-3 text-[13.5px] font-medium text-gold-100 shadow-lift">
              <CheckCircle2 size={16} className="shrink-0 text-gold-300" />
              {notice}
            </div>
          </div>
        </div>
      )}

      <p className="text-[10.5px] font-bold uppercase tracking-[0.24em] text-gold-700">
        Golden Park · Gate security
      </p>
      <h1 className="mt-1 font-display text-[28px] font-medium leading-tight text-ink">
        Who comes in, you decide
      </h1>
      <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-mute">
        Approve arrivals in real time or pre-authorise visitors with a one-time gate code.
      </p>

      {/* Segmented control */}
      <div className="mt-5 grid grid-cols-2 gap-1 rounded-2xl border border-line bg-cream p-1">
        {[
          { id: "approvals", label: "Approvals", badge: arrReady ? arrivals.length : null },
          { id: "passes", label: "My passes", badge: null },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-[13.5px] font-semibold transition active:scale-[0.97] ${
              tab === t.id ? "bg-espresso-900 text-gold-100 shadow-card" : "text-ink-soft"
            }`}
          >
            {t.label}
            {t.badge ? (
              <span
                className={`grid h-5 min-w-5 place-items-center rounded-full px-1 text-[10.5px] font-bold ${
                  tab === t.id ? "bg-gold-500 text-espresso-900" : "bg-line text-ink-soft"
                }`}
              >
                {t.badge}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {tab === "approvals" ? (
        /* ------------------------------ Approvals ----------------------------- */
        <div className="mt-6 space-y-3 pb-2">
          {!arrReady ? (
            <>
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
            </>
          ) : arrivals.length === 0 ? (
            <Empty
              icon={BellRing}
              title="Gate is quiet"
              body="When a guest or delivery arrives at the gate, the request lands here for your approval."
            />
          ) : (
            arrivals.map((a) => {
              const Icon = ARRIVAL_ICONS[a.icon] || UserRound;
              return (
                <div
                  key={a.id}
                  className="rounded-3xl border border-line bg-white p-4 shadow-card"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gold-50 text-gold-700 ring-1 ring-gold-100">
                      <Icon size={21} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[15px] font-semibold text-ink">{a.name}</p>
                      <p className="truncate text-[12.5px] text-ink-mute">{a.detail}</p>
                      <p className="mt-0.5 text-[11px] font-bold uppercase tracking-wider text-gold-700">
                        {a.gate} · waiting {a.since}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3.5 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => deny(a)}
                      className="rounded-2xl border border-line bg-white py-3 text-[14px] font-semibold text-ink-soft transition active:scale-[0.97]"
                    >
                      Deny
                    </button>
                    <button
                      onClick={() => approve(a)}
                      className="rounded-2xl bg-gradient-to-b from-gold-400 to-gold-600 py-3 text-[14px] font-semibold text-espresso-900 shadow-goldglow transition active:scale-[0.97]"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              );
            })
          )}

          <p className="flex items-center justify-center gap-1.5 pt-1 text-center text-[11.5px] text-ink-mute">
            <ShieldCheck size={13} className="text-gold-600" />
            Approvals are logged with the security desk for 90 days
          </p>
        </div>
      ) : (
        /* ------------------------------- My passes ----------------------------- */
        <div className="mt-6 pb-2">
          <Button className="w-full" onClick={openSheet}>
            <DoorOpen size={18} />
            Create gate pass
          </Button>

          <div className="mt-5">
            <SectionTitle eyebrow="Pre-authorised" title="Issued passes" />
            <div className="mt-4 space-y-3">
              {!passReady ? (
                <>
                  <Skeleton className="h-28" />
                  <Skeleton className="h-28" />
                </>
              ) : passes.length === 0 ? (
                <Empty
                  icon={QrCode}
                  title="No passes yet"
                  body="Create a pass and share the 6-digit code — your visitor walks straight in."
                />
              ) : (
                passes.map((p) => {
                  const Icon = TYPE_ICONS[p.type] || UserRound;
                  const active = p.status === "Active";
                  return (
                    <div
                      key={p.id}
                      className={`rounded-3xl border bg-white p-4 shadow-card ${
                        active ? "border-gold-200" : "border-line opacity-80"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gold-50 text-gold-700 ring-1 ring-gold-100">
                            <Icon size={19} />
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-[15px] font-semibold text-ink">
                              {p.name}
                            </p>
                            <p className="text-[12px] text-ink-mute">
                              {p.type} · {fmtDate(p.date)} · {p.validity}
                            </p>
                          </div>
                        </div>
                        <StatusPill status={p.status} />
                      </div>

                      <div className="mt-3 flex items-center justify-between rounded-2xl bg-cream/70 px-4 py-3">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink-mute">
                            Gate code
                          </p>
                          <p
                            className={`font-display text-[24px] font-semibold tracking-[0.3em] ${
                              active ? "text-gold-700" : "text-ink-mute line-through"
                            }`}
                          >
                            {p.code}
                          </p>
                        </div>
                        {active ? (
                          <button
                            onClick={() => revoke(p.id)}
                            className="rounded-full border border-line bg-white px-3.5 py-2 text-[12px] font-semibold text-ink-soft transition active:scale-95"
                          >
                            Revoke
                          </button>
                        ) : null}
                      </div>

                      {p.note ? (
                        <p className="mt-2.5 text-[12px] italic text-ink-mute">“{p.note}”</p>
                      ) : null}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create pass sheet */}
      <Sheet
        open={open}
        onClose={closeSheet}
        title={created ? "Pass ready" : "Create gate pass"}
      >
        {created ? (
          <div className="flex flex-col items-center px-2 pb-2 pt-4 text-center">
            <span className="grid h-16 w-16 animate-pop place-items-center rounded-full bg-gold-50 ring-1 ring-gold-200">
              <CheckCircle2 size={32} className="text-gold-600" />
            </span>
            <h4 className="mt-4 font-display text-2xl text-ink">
              {created.name} can walk in
            </h4>
            <p className="mt-1 text-sm text-ink-soft">
              {created.type} · {fmtDate(created.date)} · valid {created.validity}
            </p>
            <div className="mt-5 w-full rounded-3xl border border-gold-200 bg-gold-50 px-5 py-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-700">
                Share this gate code
              </p>
              <p className="mt-1 font-display text-[38px] font-semibold tracking-[0.3em] text-gold-700">
                {created.code}
              </p>
            </div>
            <p className="mt-3 max-w-[260px] text-xs leading-relaxed text-ink-mute">
              The code works once at any gate. Security also has it on their console.
            </p>
            <Button className="mt-5 w-full" onClick={closeSheet}>
              Done
            </Button>
          </div>
        ) : (
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold-700">
              Visitor name
            </p>
            <input
              className={`${inputCls} mt-2.5`}
              placeholder="e.g. Meera Joshi"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.18em] text-gold-700">
              Type
            </p>
            <div className="mt-2.5 grid grid-cols-2 gap-2">
              {VISITOR_TYPES.map((t) => {
                const Icon = TYPE_ICONS[t];
                const selected = type === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`flex items-center gap-2.5 rounded-2xl border px-3.5 py-3 text-left transition active:scale-[0.97] ${
                      selected
                        ? "border-gold-500 bg-gold-50 shadow-[inset_0_0_0_1px_#BC9440]"
                        : "border-line bg-white"
                    }`}
                  >
                    <Icon size={18} className={selected ? "text-gold-700" : "text-ink-mute"} />
                    <span
                      className={`text-[14px] font-semibold ${
                        selected ? "text-gold-800" : "text-ink-soft"
                      }`}
                    >
                      {t}
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.18em] text-gold-700">
              Visit date
            </p>
            <input
              type="date"
              min={todayISO()}
              className={`${inputCls} mt-2.5`}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.18em] text-gold-700">
              Valid for
            </p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {PASS_VALIDITY.map((v) => (
                <Chip key={v} selected={validity === v} onClick={() => setValidity(v)}>
                  {v}
                </Chip>
              ))}
            </div>

            <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.18em] text-gold-700">
              Note for security{" "}
              <span className="font-medium normal-case text-ink-mute">(optional)</span>
            </p>
            <input
              className={`${inputCls} mt-2.5`}
              placeholder="e.g. Carrying a birthday cake"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />

            <Button className="mt-5 w-full" disabled={!canCreate} onClick={createPass}>
              Generate gate code
            </Button>
          </div>
        )}
      </Sheet>
    </div>
  );
}
