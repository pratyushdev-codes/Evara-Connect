"use client";

import { useState } from "react";
import { CheckCircle2, MessageSquareWarning, Ticket } from "lucide-react";
import { COMPLAINT_CATEGORIES, RESIDENT } from "@/lib/data";
import { fmtStamp, uid, useStore } from "@/lib/store";
import Sheet from "@/components/Sheet";
import { Button, Chip, Empty, SectionTitle, Skeleton, StatusPill, inputCls } from "@/components/ui";

const FILTERS = ["All", "Open", "Resolved"];

export default function ComplaintsPage() {
  const [complaints, setComplaints, ready] = useStore("gp_complaints", []);

  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState(null);
  const [subject, setSubject] = useState("");
  const [desc, setDesc] = useState("");
  const [urgent, setUrgent] = useState(false);
  const [placed, setPlaced] = useState(null);
  const [filter, setFilter] = useState("All");

  const openSheet = () => {
    setCategory(null);
    setSubject("");
    setDesc("");
    setUrgent(false);
    setPlaced(null);
    setOpen(true);
  };

  const closeSheet = () => {
    setOpen(false);
    setPlaced(null);
  };

  const submit = () => {
    const ticket = {
      id: uid("TKT"),
      category,
      subject: subject.trim(),
      desc: desc.trim(),
      urgent,
      status: "Open",
      createdAt: Date.now(),
    };
    setComplaints((prev) => [ticket, ...prev]);
    setPlaced(ticket);
  };

  const resolve = (id) =>
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "Resolved" } : c))
    );

  const canSubmit = category && subject.trim().length > 2;

  const visible =
    filter === "All" ? complaints : complaints.filter((c) => c.status === filter);

  return (
    <div className="px-5 pt-7">
      <p className="text-[10.5px] font-bold uppercase tracking-[0.24em] text-gold-700">
        Golden Park · Helpdesk
      </p>
      <h1 className="mt-1 font-display text-[28px] font-medium leading-tight text-ink">
        Raise it, we&rsquo;ll fix it
      </h1>
      <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-mute">
        Tickets for flat {RESIDENT.flat} go straight to the facility desk. Most issues are
        closed within 24 hours.
      </p>

      <Button className="mt-5 w-full" onClick={openSheet}>
        <MessageSquareWarning size={18} />
        Raise a complaint
      </Button>

      {/* Tickets */}
      <div className="mt-8 pb-2">
        <SectionTitle eyebrow="Your tickets" title="Complaint history" />

        <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto">
          {FILTERS.map((f) => (
            <Chip key={f} selected={filter === f} onClick={() => setFilter(f)}>
              {f}
            </Chip>
          ))}
        </div>

        <div className="mt-4 space-y-3">
          {!ready ? (
            <>
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
            </>
          ) : visible.length === 0 ? (
            <Empty
              icon={Ticket}
              title={filter === "All" ? "No complaints yet" : `Nothing ${filter.toLowerCase()}`}
              body="Lift acting up? Leaky corridor? Raise a ticket and track it here."
            />
          ) : (
            visible.map((c) => (
              <div
                key={c.id}
                className="rounded-3xl border border-line bg-white p-4 shadow-card"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-mono text-[11px] font-bold tracking-wider text-ink-mute">
                      {c.id} · {fmtStamp(c.createdAt)}
                    </p>
                    <p className="mt-1 truncate text-[15px] font-semibold text-ink">
                      {c.subject}
                    </p>
                    <p className="mt-0.5 text-[12.5px] text-ink-mute">{c.category}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <StatusPill status={c.status} />
                    {c.urgent && c.status === "Open" ? <StatusPill status="Urgent" /> : null}
                  </div>
                </div>

                {c.desc ? (
                  <p className="mt-2.5 rounded-2xl bg-cream/70 px-3.5 py-2.5 text-[13px] leading-relaxed text-ink-soft">
                    {c.desc}
                  </p>
                ) : null}

                {c.status === "Open" ? (
                  <button
                    onClick={() => resolve(c.id)}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-line bg-cream px-3.5 py-2 text-[12.5px] font-semibold text-ink-soft transition active:scale-95"
                  >
                    <CheckCircle2 size={14} className="text-gold-600" />
                    Mark resolved
                  </button>
                ) : null}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Raise complaint sheet */}
      <Sheet
        open={open}
        onClose={closeSheet}
        title={placed ? "Ticket created" : "Raise a complaint"}
      >
        {placed ? (
          <div className="flex flex-col items-center px-2 pb-2 pt-4 text-center">
            <span className="grid h-16 w-16 animate-pop place-items-center rounded-full bg-gold-50 ring-1 ring-gold-200">
              <CheckCircle2 size={32} className="text-gold-600" />
            </span>
            <h4 className="mt-4 font-display text-2xl text-ink">We&rsquo;re on it</h4>
            <p className="mt-1 text-sm text-ink-soft">
              Ticket <span className="font-mono font-bold text-ink">{placed.id}</span> ·{" "}
              {placed.category}
            </p>
            <p className="mt-3 max-w-[260px] text-xs leading-relaxed text-ink-mute">
              The facility desk has been notified{placed.urgent ? " and flagged this as urgent" : ""}.
              You&rsquo;ll get updates here and on SMS.
            </p>
            <Button className="mt-6 w-full" onClick={closeSheet}>
              Done
            </Button>
          </div>
        ) : (
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold-700">
              Category
            </p>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {COMPLAINT_CATEGORIES.map((c) => (
                <Chip key={c} selected={category === c} onClick={() => setCategory(c)}>
                  {c}
                </Chip>
              ))}
            </div>

            <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.18em] text-gold-700">
              Subject
            </p>
            <input
              className={`${inputCls} mt-2.5`}
              placeholder="e.g. Water seepage near the lift lobby"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />

            <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.18em] text-gold-700">
              Details <span className="font-medium normal-case text-ink-mute">(optional)</span>
            </p>
            <textarea
              className={`${inputCls} mt-2.5 min-h-[88px] resize-none`}
              placeholder="Where exactly, since when, anything the staff should know…"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />

            <button
              type="button"
              onClick={() => setUrgent((u) => !u)}
              className={`mt-4 flex w-full items-center justify-between rounded-2xl border px-4 py-3.5 text-left transition active:scale-[0.98] ${
                urgent ? "border-red-300 bg-red-50" : "border-line bg-cream/60"
              }`}
            >
              <div>
                <p className={`text-[14px] font-semibold ${urgent ? "text-red-600" : "text-ink"}`}>
                  Mark as urgent
                </p>
                <p className="text-[11.5px] text-ink-mute">
                  Safety hazards & outages jump the queue
                </p>
              </div>
              <span
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                  urgent ? "bg-red-500" : "bg-line"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                    urgent ? "left-[22px]" : "left-0.5"
                  }`}
                />
              </span>
            </button>

            <Button className="mt-5 w-full" disabled={!canSubmit} onClick={submit}>
              Submit complaint
            </Button>
          </div>
        )}
      </Sheet>
    </div>
  );
}
