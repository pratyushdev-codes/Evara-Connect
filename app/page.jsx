"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Bell,
  Check,
  CheckCircle2,
  ChevronRight,
  Heart,
  IndianRupee,
  MessageCircle,
  MessageSquareWarning,
  Package,
  Pin,
  UserRound,
  UserRoundPlus,
  UtensilsCrossed,
  Wrench,
  X,
} from "lucide-react";
import {
  ANNOUNCEMENTS,
  ARRIVALS_SEED,
  PASS_SEED,
  RESIDENT,
} from "@/lib/data";
import { inr, makePassFromArrival, useStore } from "@/lib/store";
import { SectionTitle, Skeleton } from "@/components/ui";
import PaySheet from "@/components/PaySheet";

const ARRIVAL_ICONS = { food: UtensilsCrossed, package: Package, guest: UserRound };

const TAG_STYLES = {
  Festive: "border-gold-200 bg-gold-50 text-gold-800",
  Notice: "border-amber-200 bg-amber-50 text-amber-700",
  Community: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Maintenance: "border-stone-200 bg-stone-100 text-stone-600",
  Clubhouse: "border-gold-200 bg-gold-50 text-gold-800",
};

export default function HomePage() {
  const [arrivals, setArrivals, ready] = useStore("gp_arrivals", ARRIVALS_SEED);
  const [, setPasses] = useStore("gp_passes", PASS_SEED);
  const [likes, setLikes] = useStore("gp_likes", {});
  const [duesPaid, setDuesPaid] = useStore("gp_dues_paid", false);
  const [requests, , reqReady] = useStore("gp_requests", []);
  const [complaints] = useStore("gp_complaints", []);

  const [payOpen, setPayOpen] = useState(false);
  const [greeting, setGreeting] = useState("Welcome home");
  const [notice, setNotice] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const noticeTimer = useRef(null);

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening");
  }, []);

  const flash = (msg) => {
    setNotice(msg);
    window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(null), 3200);
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

  const toggleLike = (id) => setLikes((m) => ({ ...m, [id]: !m[id] }));

  const openBookings = requests.filter((r) => r.status === "Confirmed").length;
  const openTickets = complaints.filter((c) => c.status === "Open").length;

  const quickActions = [
    { label: "Complaint", icon: MessageSquareWarning, href: "/complaints" },
    { label: "Book service", icon: Wrench, href: "/services" },
    { label: "Invite guest", icon: UserRoundPlus, href: "/gatepass" },
    { label: "Pay dues", icon: IndianRupee, onClick: () => setPayOpen(true) },
  ];

  return (
    <div>
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

      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-line/70 bg-cream/90 backdrop-blur-xl">
        <div className="flex items-center justify-between px-5 py-3.5">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 rotate-45 place-items-center rounded-[10px] bg-espresso-900 shadow-card">
              <span className="-rotate-45 font-display text-[12px] font-semibold text-gold-300">
                GP
              </span>
            </span>
            <div>
              <p className="font-display text-[17px] font-semibold leading-none text-ink">
                Golden Park
              </p>
              <p className="mt-1 text-[9.5px] font-bold uppercase tracking-[0.28em] text-gold-700">
                Residences
              </p>
            </div>
          </div>
          <button
            aria-label="Notifications"
            className="relative grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-ink-soft transition active:scale-90"
          >
            <Bell size={18} />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-gold-500 ring-2 ring-white" />
          </button>
        </div>
      </header>

      <div className="space-y-7 px-5 pt-5">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-[28px] shadow-lift">
          <img
            src="/tower-dusk.jpg"
            alt="Golden Park towers at dusk"
            className="absolute inset-0 h-full w-full object-cover object-[center_35%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-espresso-900 via-espresso-900/75 to-espresso-900/25" />
          <div className="relative p-5 pt-20 text-cream">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-gold-300">
              {greeting}
            </p>
            <h1 className="mt-1 font-display text-[30px] font-medium leading-tight">
              {RESIDENT.firstName}
            </h1>
            <div className="mt-2 flex items-center gap-2">
              <span className="rounded-full border border-gold-400/40 bg-espresso-900/50 px-2.5 py-1 text-[11px] font-semibold text-gold-200">
                {RESIDENT.tower} · {RESIDENT.flat}
              </span>
              <span className="rounded-full border border-gold-400/40 bg-espresso-900/50 px-2.5 py-1 text-[11px] font-semibold text-gold-200">
                {RESIDENT.role} since {RESIDENT.since}
              </span>
            </div>

            <div className="mt-5 flex items-center justify-between rounded-2xl border border-gold-400/25 bg-espresso-900/60 p-3.5 backdrop-blur-sm">
              {duesPaid ? (
                <>
                  <div>
                    <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-gold-300">
                      Society dues
                    </p>
                    <p className="mt-0.5 flex items-center gap-1.5 font-display text-[19px] text-gold-100">
                      <Check size={16} className="text-gold-300" /> All cleared
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold text-gold-300/80">
                    {RESIDENT.duesPeriod}
                  </span>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-gold-300">
                      Dues · {RESIDENT.duesPeriod}
                    </p>
                    <p className="mt-0.5 font-display text-[22px] font-semibold text-gold-100">
                      {inr(RESIDENT.dues)}
                    </p>
                  </div>
                  <button
                    onClick={() => setPayOpen(true)}
                    className="rounded-xl bg-gradient-to-b from-gold-400 to-gold-600 px-4 py-2.5 text-[13px] font-bold text-espresso-900 shadow-goldglow transition active:scale-95"
                  >
                    Pay now
                  </button>
                </>
              )}
            </div>
          </div>
        </section>

        {/* At the gate */}
        <section>
          <SectionTitle
            eyebrow="Live from security"
            title="At the gate"
            action={
              <Link
                href="/gatepass"
                className="flex items-center gap-0.5 pb-1 text-[12.5px] font-bold text-gold-700"
              >
                All passes <ChevronRight size={14} />
              </Link>
            }
          />
          <div className="mt-3 space-y-3">
            {!ready ? (
              <Skeleton className="h-[76px]" />
            ) : arrivals.length === 0 ? (
              <div className="flex items-center gap-3 rounded-3xl border border-line bg-white p-4 shadow-card">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gold-50 text-gold-600 ring-1 ring-gold-100">
                  <Check size={20} />
                </span>
                <div>
                  <p className="text-[15px] font-semibold text-ink">All clear right now</p>
                  <p className="text-[12.5px] text-ink-mute">
                    Visitors who arrive for {RESIDENT.flat} will appear here.
                  </p>
                </div>
              </div>
            ) : (
              arrivals.map((a) => {
                const Icon = ARRIVAL_ICONS[a.icon] || UserRound;
                return (
                  <div
                    key={a.id}
                    className="animate-fade rounded-3xl border border-line bg-white p-4 shadow-card"
                  >
                    <div className="flex items-start gap-3">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gold-50 text-gold-700 ring-1 ring-gold-100">
                        <Icon size={20} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[15px] font-semibold text-ink">{a.name}</p>
                        <p className="truncate text-[12.5px] text-ink-mute">{a.detail}</p>
                        <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-gold-700">
                          {a.gate} · waiting {a.since}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2.5">
                      <button
                        onClick={() => deny(a)}
                        className="flex items-center justify-center gap-1.5 rounded-xl border border-line bg-white py-2.5 text-[13.5px] font-semibold text-ink-soft transition active:scale-95"
                      >
                        <X size={15} /> Deny
                      </button>
                      <button
                        onClick={() => approve(a)}
                        className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-b from-gold-400 to-gold-600 py-2.5 text-[13.5px] font-bold text-espresso-900 shadow-goldglow transition active:scale-95"
                      >
                        <Check size={15} /> Approve
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Quick actions */}
        <section>
          <div className="grid grid-cols-4 gap-2.5">
            {quickActions.map((q) => {
              const Icon = q.icon;
              const inner = (
                <>
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gold-50 text-gold-700 ring-1 ring-gold-100 transition group-active:scale-90">
                    <Icon size={20} />
                  </span>
                  <span className="text-[11px] font-semibold leading-tight text-ink-soft">
                    {q.label}
                  </span>
                </>
              );
              const cls =
                "group flex flex-col items-center gap-2 rounded-3xl border border-line bg-white px-1 py-3.5 text-center shadow-card transition active:scale-[0.97]";
              return q.href ? (
                <Link key={q.label} href={q.href} className={cls}>
                  {inner}
                </Link>
              ) : (
                <button key={q.label} onClick={q.onClick} className={cls}>
                  {inner}
                </button>
              );
            })}
          </div>
        </section>

        {/* Announcements */}
        <section>
          <SectionTitle eyebrow="Trending in the community" title="Notices & buzz" />
          <div className="mt-3 space-y-3">
            {ANNOUNCEMENTS.map((a) => {
              const liked = !!likes[a.id];
              const isOpen = expanded === a.id;
              return (
                <article
                  key={a.id}
                  className="rounded-3xl border border-line bg-white p-4 shadow-card"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[10.5px] font-bold tracking-wide ${
                          TAG_STYLES[a.tag] || "border-line bg-cream text-ink-soft"
                        }`}
                      >
                        {a.tag}
                      </span>
                      {a.pinned && <Pin size={13} className="fill-gold-200 text-gold-600" />}
                    </div>
                    <span className="text-[11px] font-semibold text-ink-mute">{a.date}</span>
                  </div>
                  <h3 className="mt-2.5 font-display text-[17.5px] font-medium leading-snug text-ink">
                    {a.title}
                  </h3>
                  <p
                    className={`mt-1.5 text-[13.5px] leading-relaxed text-ink-soft ${
                      isOpen ? "" : "line-clamp-2"
                    }`}
                  >
                    {a.body}
                  </p>
                  <div className="mt-3 flex items-center gap-4 border-t border-line/70 pt-3">
                    <button
                      onClick={() => toggleLike(a.id)}
                      className="flex items-center gap-1.5 text-[12.5px] font-semibold text-ink-soft transition active:scale-90"
                    >
                      <Heart
                        size={15}
                        className={liked ? "fill-gold-500 text-gold-600" : "text-ink-mute"}
                      />
                      {a.likes + (liked ? 1 : 0)}
                    </button>
                    <span className="flex items-center gap-1.5 text-[12.5px] font-semibold text-ink-soft">
                      <MessageCircle size={15} className="text-ink-mute" />
                      {a.comments}
                    </span>
                    <button
                      onClick={() => setExpanded(isOpen ? null : a.id)}
                      className="ml-auto text-[12.5px] font-bold text-gold-700"
                    >
                      {isOpen ? "Show less" : "Read more"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* My desk */}
        <section className="pb-2">
          <SectionTitle eyebrow="Your desk" title="In progress" />
          <div className="mt-3 grid grid-cols-2 gap-3">
            {!reqReady ? (
              <>
                <Skeleton className="h-[88px]" />
                <Skeleton className="h-[88px]" />
              </>
            ) : (
              <>
                <Link
                  href="/services"
                  className="rounded-3xl border border-line bg-white p-4 shadow-card transition active:scale-[0.97]"
                >
                  <p className="font-display text-[26px] font-semibold text-gold-700">
                    {openBookings}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-[12.5px] font-semibold text-ink-soft">
                    Service visits booked <ChevronRight size={13} className="text-gold-600" />
                  </p>
                </Link>
                <Link
                  href="/complaints"
                  className="rounded-3xl border border-line bg-white p-4 shadow-card transition active:scale-[0.97]"
                >
                  <p className="font-display text-[26px] font-semibold text-gold-700">
                    {openTickets}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-[12.5px] font-semibold text-ink-soft">
                    Open complaints <ChevronRight size={13} className="text-gold-600" />
                  </p>
                </Link>
              </>
            )}
          </div>
          <p className="mt-7 text-center font-display text-[13px] italic text-ink-mute">
            “Come home to the good life.” — Golden Park
          </p>
        </section>
      </div>

      <PaySheet
        open={payOpen}
        onClose={() => setPayOpen(false)}
        paid={duesPaid}
        onPaid={() => setDuesPaid(true)}
      />
    </div>
  );
}
