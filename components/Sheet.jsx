"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

export default function Sheet({ open, onClose, title, children }) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 animate-fade bg-espresso-900/55 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div className="absolute inset-x-0 bottom-0 mx-auto max-w-md">
        <div className="animate-rise rounded-t-[30px] border border-b-0 border-line bg-white px-5 pb-8 pt-3 shadow-lift">
          <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-line" />
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-[22px] font-medium text-ink">{title}</h3>
            <button
              onClick={onClose}
              aria-label="Close"
              className="grid h-9 w-9 place-items-center rounded-full bg-cream text-ink-soft transition active:scale-90"
            >
              <X size={17} />
            </button>
          </div>
          <div className="no-scrollbar max-h-[72vh] overflow-y-auto pb-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
