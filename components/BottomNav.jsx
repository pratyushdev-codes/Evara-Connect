"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircleUserRound, DoorOpen, Home, ShoppingBasket, Wrench } from "lucide-react";

function Item({ href, label, icon: Icon, path }) {
  const active = href === "/" ? path === "/" : path.startsWith(href);
  return (
    <Link href={href} className="flex flex-1 flex-col items-center gap-1 pb-1 pt-3">
      <Icon
        size={21}
        strokeWidth={active ? 2.4 : 1.8}
        className={active ? "text-gold-600" : "text-ink-mute"}
      />
      <span
        className={`text-[10.5px] font-semibold tracking-wide ${
          active ? "text-gold-700" : "text-ink-mute"
        }`}
      >
        {label}
      </span>
      <span className={`h-1 w-1 rounded-full ${active ? "bg-gold-500" : "bg-transparent"}`} />
    </Link>
  );
}

export default function BottomNav() {
  const path = usePathname();
  const gateActive = path.startsWith("/gatepass");

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40">
      <div className="mx-auto max-w-md border-t border-line bg-white/95 px-2 pb-[max(10px,env(safe-area-inset-bottom))] backdrop-blur-xl sm:border-x">
        <div className="flex items-end">
          <Item href="/" label="Home" icon={Home} path={path} />
          <Item href="/services" label="Services" icon={Wrench} path={path} />

          <Link href="/gatepass" className="-mt-7 flex flex-col items-center gap-1 px-3">
            <span
              className={`grid h-14 w-14 place-items-center rounded-full border-4 border-cream bg-gradient-to-b from-gold-400 to-gold-600 text-espresso-900 shadow-goldglow transition active:scale-95 ${
                gateActive ? "ring-2 ring-gold-300" : ""
              }`}
            >
              <DoorOpen size={24} strokeWidth={2.2} />
            </span>
            <span
              className={`pb-1 text-[10.5px] font-semibold tracking-wide ${
                gateActive ? "text-gold-700" : "text-ink-mute"
              }`}
            >
              Gate Pass
            </span>
          </Link>

          <Item href="/market" label="Market" icon={ShoppingBasket} path={path} />
          <Item href="/account" label="Account" icon={CircleUserRound} path={path} />
        </div>
      </div>
    </nav>
  );
}
