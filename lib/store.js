"use client";

import { useEffect, useState } from "react";

/**
 * useStore — tiny localStorage-backed state.
 * Reads the key on mount (seeding it if absent), then writes on every update.
 * `ready` flips to true after hydration so lists can render without a
 * server/client mismatch flash.
 */
export function useStore(key, seed) {
  const [data, setData] = useState(seed);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) {
        setData(JSON.parse(raw));
      } else {
        window.localStorage.setItem(key, JSON.stringify(seed));
      }
    } catch {
      /* private mode / blocked storage — keep in-memory state */
    }
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const update = (next) => {
    setData((prev) => {
      const value = typeof next === "function" ? next(prev) : next;
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch {
        /* ignore */
      }
      return value;
    });
  };

  return [data, update, ready];
}

export const STORAGE_KEYS = [
  "gp_requests",
  "gp_complaints",
  "gp_passes",
  "gp_arrivals",
  "gp_cart",
  "gp_orders",
  "gp_dues_paid",
  "gp_likes",
];

export const uid = (prefix = "GP") =>
  `${prefix}-${Math.random().toString(36).slice(2, 6).toUpperCase()}${Date.now().toString().slice(-3)}`;

export const otp6 = () => String(Math.floor(100000 + Math.random() * 900000));

export const inr = (n) =>
  "₹" +
  Number(n).toLocaleString("en-IN", {
    minimumFractionDigits: Number(n) % 1 ? 2 : 0,
    maximumFractionDigits: 2,
  });

export const todayISO = () => new Date().toISOString().slice(0, 10);

export const fmtDate = (iso) => {
  if (!iso) return "Today";
  if (iso === todayISO()) return "Today";
  return new Date(iso + "T00:00:00").toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
};

export const fmtStamp = (ts) =>
  new Date(ts).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

export const makePassFromArrival = (a) => ({
  id: uid("PS"),
  code: otp6(),
  name: a.name,
  type: a.icon === "guest" ? "Guest" : "Delivery",
  date: todayISO(),
  validity: "Single entry",
  note: `Approved from ${a.gate} request`,
  status: "Active",
  createdAt: Date.now(),
});
