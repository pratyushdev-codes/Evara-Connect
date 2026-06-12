"use client";

import { useState } from "react";
import { BadgeCheck, ShieldCheck } from "lucide-react";
import Sheet from "./Sheet";
import { Button } from "./ui";
import { inr } from "@/lib/store";
import { DUES_BREAKUP, RESIDENT } from "@/lib/data";

export default function PaySheet({ open, onClose, paid, onPaid }) {
  const [justPaid, setJustPaid] = useState(false);

  const close = () => {
    setJustPaid(false);
    onClose();
  };

  return (
    <Sheet open={open} onClose={close} title="Society dues">
      {paid || justPaid ? (
        <div className="flex flex-col items-center px-2 pb-2 pt-5 text-center">
          <span className="grid h-16 w-16 animate-pop place-items-center rounded-full bg-gold-50 ring-1 ring-gold-200">
            <BadgeCheck size={34} className="text-gold-600" />
          </span>
          <h4 className="mt-4 font-display text-2xl text-ink">All dues cleared</h4>
          <p className="mt-1 text-sm text-ink-soft">
            {inr(RESIDENT.dues)} paid for {RESIDENT.duesPeriod} · Flat {RESIDENT.flat}
          </p>
          <p className="mt-3 text-xs text-ink-mute">
            A stamped receipt has been mailed to you and saved under Account → Documents.
          </p>
          <Button className="mt-6 w-full" onClick={close}>
            Done
          </Button>
        </div>
      ) : (
        <div>
          <div className="rounded-3xl border border-line bg-cream/60 p-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold-700">
              {RESIDENT.duesPeriod} · Flat {RESIDENT.flat}
            </p>
            <div className="mt-3 space-y-2.5">
              {DUES_BREAKUP.map((row) => (
                <div key={row.label} className="flex items-center justify-between text-[14px]">
                  <span className="text-ink-soft">{row.label}</span>
                  <span className="font-semibold text-ink">{inr(row.amount)}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
              <span className="text-sm font-semibold text-ink">Total payable</span>
              <span className="font-display text-[22px] font-semibold text-gold-700">
                {inr(RESIDENT.dues)}
              </span>
            </div>
          </div>

          <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-ink-mute">
            <ShieldCheck size={14} className="text-gold-600" />
            Secured by Golden Park Pay · UPI, cards & netbanking
          </p>

          <Button
            className="mt-4 w-full"
            onClick={() => {
              onPaid();
              setJustPaid(true);
            }}
          >
            Pay {inr(RESIDENT.dues)}
          </Button>
        </div>
      )}
    </Sheet>
  );
}
