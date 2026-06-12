"use client";

import { useMemo, useState } from "react";
import { Bike, CheckCircle2, MapPin, Minus, Plus, ShoppingBasket, Timer } from "lucide-react";
import { MARKET_CATEGORIES, PRODUCTS, RESIDENT } from "@/lib/data";
import { inr, uid, useStore } from "@/lib/store";
import Sheet from "@/components/Sheet";
import { Button, Chip, SectionTitle, Skeleton } from "@/components/ui";

export default function MarketPage() {
  const [cart, setCart, cartReady] = useStore("gp_cart", {});
  const [, setOrders] = useStore("gp_orders", []);

  const [cat, setCat] = useState("all");
  const [cartOpen, setCartOpen] = useState(false);
  const [placed, setPlaced] = useState(null);

  const visible = cat === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.cat === cat);

  const lines = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, qty]) => {
          const p = PRODUCTS.find((x) => x.id === id);
          return p && qty > 0 ? { ...p, qty } : null;
        })
        .filter(Boolean),
    [cart]
  );

  const count = lines.reduce((n, l) => n + l.qty, 0);
  const total = lines.reduce((n, l) => n + l.qty * l.price, 0);

  const add = (id) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const remove = (id) =>
    setCart((c) => {
      const next = { ...c, [id]: (c[id] || 0) - 1 };
      if (next[id] <= 0) delete next[id];
      return next;
    });

  const placeOrder = () => {
    const order = {
      id: uid("ORD"),
      items: lines.map(({ id, name, qty, price, emoji }) => ({ id, name, qty, price, emoji })),
      total,
      eta: "15–25 min",
      status: "On the way",
      createdAt: Date.now(),
    };
    setOrders((prev) => [order, ...prev]);
    setCart({});
    setPlaced(order);
  };

  const closeCart = () => {
    setCartOpen(false);
    setPlaced(null);
  };

  return (
    <div className="px-5 pt-7">
      <p className="text-[10.5px] font-bold uppercase tracking-[0.24em] text-gold-700">
        Golden Park · Society market
      </p>
      <h1 className="mt-1 font-display text-[28px] font-medium leading-tight text-ink">
        Groceries, gate to door
      </h1>
      <p className="mt-1.5 flex items-center gap-1.5 text-[13.5px] leading-relaxed text-ink-mute">
        <Timer size={14} className="text-gold-600" />
        From the plaza store · delivered to {RESIDENT.flat} in 15–25 min
      </p>

      {/* Categories */}
      <div className="no-scrollbar -mx-5 mt-5 flex gap-2 overflow-x-auto px-5">
        {MARKET_CATEGORIES.map((c) => (
          <Chip
            key={c.id}
            selected={cat === c.id}
            onClick={() => setCat(c.id)}
            className="shrink-0"
          >
            {c.label}
          </Chip>
        ))}
      </div>

      {/* Products */}
      {!cartReady ? (
        <div className="mt-5 grid grid-cols-2 gap-3">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-2 gap-3 pb-2">
          {visible.map((p) => {
            const qty = cart[p.id] || 0;
            return (
              <div
                key={p.id}
                className="flex flex-col rounded-3xl border border-line bg-white p-3.5 shadow-card"
              >
                <div className="grid h-20 place-items-center rounded-2xl bg-gold-50 text-[38px] ring-1 ring-gold-100">
                  {p.emoji}
                </div>
                <p className="mt-2.5 text-[14px] font-semibold leading-snug text-ink">
                  {p.name}
                </p>
                <p className="mt-0.5 text-[11.5px] text-ink-mute">{p.unit}</p>
                <div className="mt-auto flex items-center justify-between pt-2.5">
                  <p className="text-[15px] font-bold text-ink">{inr(p.price)}</p>
                  {qty === 0 ? (
                    <button
                      onClick={() => add(p.id)}
                      className="rounded-full bg-gradient-to-b from-gold-400 to-gold-600 px-4 py-1.5 text-[12.5px] font-bold text-espresso-900 shadow-goldglow transition active:scale-90"
                    >
                      Add
                    </button>
                  ) : (
                    <div className="flex items-center gap-2.5 rounded-full bg-espresso-900 px-2 py-1">
                      <button
                        onClick={() => remove(p.id)}
                        aria-label="Remove one"
                        className="grid h-6 w-6 place-items-center rounded-full text-gold-200 transition active:scale-75"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="min-w-3 text-center text-[13px] font-bold text-gold-100">
                        {qty}
                      </span>
                      <button
                        onClick={() => add(p.id)}
                        aria-label="Add one"
                        className="grid h-6 w-6 place-items-center rounded-full text-gold-200 transition active:scale-75"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating cart bar */}
      {count > 0 && (
        <div className="fixed inset-x-0 bottom-[88px] z-40">
          <div className="mx-auto max-w-md px-5">
            <button
              onClick={() => setCartOpen(true)}
              className="flex w-full animate-rise items-center justify-between rounded-2xl border border-gold-700/40 bg-espresso-900 px-4.5 py-3.5 pl-4 pr-4 shadow-lift transition active:scale-[0.98]"
            >
              <span className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-gold-500/15 text-gold-300">
                  <ShoppingBasket size={18} />
                </span>
                <span className="text-left">
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-gold-400">
                    {count} item{count > 1 ? "s" : ""} · {inr(total)}
                  </span>
                  <span className="block text-[14.5px] font-semibold text-gold-100">
                    View basket
                  </span>
                </span>
              </span>
              <span className="rounded-full bg-gradient-to-b from-gold-400 to-gold-600 px-4 py-2 text-[13px] font-bold text-espresso-900">
                Checkout
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Cart sheet */}
      <Sheet
        open={cartOpen}
        onClose={closeCart}
        title={placed ? "Order placed" : "Your basket"}
      >
        {placed ? (
          <div className="flex flex-col items-center px-2 pb-2 pt-4 text-center">
            <span className="grid h-16 w-16 animate-pop place-items-center rounded-full bg-gold-50 ring-1 ring-gold-200">
              <Bike size={32} className="text-gold-600" />
            </span>
            <h4 className="mt-4 font-display text-2xl text-ink">Rider on the way</h4>
            <p className="mt-1 text-sm text-ink-soft">
              Order <span className="font-mono font-bold text-ink">{placed.id}</span> ·{" "}
              {inr(placed.total)}
            </p>
            <div className="mt-4 w-full rounded-3xl border border-line bg-cream/60 px-4 py-3.5 text-left">
              {placed.items.map((it) => (
                <div key={it.id} className="flex items-center justify-between py-1 text-[13.5px]">
                  <span className="text-ink-soft">
                    {it.emoji} {it.name} × {it.qty}
                  </span>
                  <span className="font-semibold text-ink">{inr(it.qty * it.price)}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-xs text-ink-mute">
              <Timer size={13} className="text-gold-600" />
              Arriving at {RESIDENT.flat} in {placed.eta} · track under Account
            </p>
            <Button className="mt-5 w-full" onClick={closeCart}>
              Done
            </Button>
          </div>
        ) : lines.length === 0 ? (
          <div className="px-2 pb-4 pt-2 text-center">
            <p className="font-display text-xl text-ink">Basket is empty</p>
            <p className="mt-1 text-sm text-ink-mute">Add a few essentials to get started.</p>
            <Button className="mt-5 w-full" variant="ghost" onClick={closeCart}>
              Keep shopping
            </Button>
          </div>
        ) : (
          <div>
            <div className="space-y-3">
              {lines.map((l) => (
                <div key={l.id} className="flex items-center gap-3">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gold-50 text-[22px] ring-1 ring-gold-100">
                    {l.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-semibold text-ink">{l.name}</p>
                    <p className="text-[11.5px] text-ink-mute">
                      {l.unit} · {inr(l.price)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 rounded-full border border-line bg-cream px-1.5 py-1">
                    <button
                      onClick={() => remove(l.id)}
                      aria-label="Remove one"
                      className="grid h-6 w-6 place-items-center rounded-full text-ink-soft transition active:scale-75"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="min-w-3 text-center text-[13px] font-bold text-ink">
                      {l.qty}
                    </span>
                    <button
                      onClick={() => add(l.id)}
                      aria-label="Add one"
                      className="grid h-6 w-6 place-items-center rounded-full text-ink-soft transition active:scale-75"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-3xl border border-line bg-cream/60 px-4 py-3.5">
              <div className="flex items-center justify-between text-[13.5px]">
                <span className="text-ink-soft">Item total</span>
                <span className="font-semibold text-ink">{inr(total)}</span>
              </div>
              <div className="mt-1.5 flex items-center justify-between text-[13.5px]">
                <span className="text-ink-soft">Delivery</span>
                <span className="font-semibold text-gold-700">Free for residents</span>
              </div>
              <div className="mt-2.5 flex items-center justify-between border-t border-line pt-2.5">
                <span className="text-sm font-semibold text-ink">To pay</span>
                <span className="font-display text-[20px] font-semibold text-gold-700">
                  {inr(total)}
                </span>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2.5 rounded-2xl border border-line bg-white px-4 py-3">
              <MapPin size={16} className="shrink-0 text-gold-600" />
              <p className="text-[12.5px] leading-snug text-ink-soft">
                Deliver to <span className="font-semibold text-ink">Flat {RESIDENT.flat}</span>,{" "}
                {RESIDENT.tower}, {RESIDENT.society}
              </p>
            </div>

            <Button className="mt-4 w-full" onClick={placeOrder}>
              Place order · {inr(total)}
            </Button>
          </div>
        )}
      </Sheet>
    </div>
  );
}
