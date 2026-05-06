"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import posthog from "posthog-js";

type Listing = {
  id: string;
  titel: string;
  ort: string;
  typ: string;
  flaeche: string;
  href: string;
  src: string;
  span: string;
  imgClass: string;
};

type RawElement = {
  "@xsi.type"?: string;
  "@id": string;
  title?: string;
  address?: { street?: string; houseNumber?: string; city?: string };
  livingSpace?: number;
};

const SPANS = [
  { span: "col-span-1 md:col-span-2 md:row-span-2", imgClass: "object-cover object-[25%_center]" },
  { span: "col-span-1 row-span-1", imgClass: "object-cover object-center" },
  { span: "col-span-1 row-span-1", imgClass: "object-cover object-right" },
  { span: "col-span-1 row-span-1", imgClass: "object-cover object-center" },
  { span: "col-span-1 md:col-span-2", imgClass: "object-cover object-[25%_40%]" },
  { span: "col-span-1 md:row-span-2", imgClass: "object-cover object-center" },
  { span: "col-span-1 md:col-span-2", imgClass: "object-cover object-[30%_70%]" },
];

const BACKGROUNDS = ["/backgrounds/facade.png", "/backgrounds/chess.png"];

function parseListings(elements: RawElement[]): Listing[] {
  return elements.map((el, i) => {
    const { span, imgClass } = SPANS[i % SPANS.length];
    const street = [el.address?.street, el.address?.houseNumber].filter(Boolean).join(" ");
    const ort = [street, el.address?.city].filter(Boolean).join(", ") || "—";
    const typ = (el["@xsi.type"] ?? "").replace(/^offerlistelement:/, "").replace(/([A-Z])/g, " $1").trim();
    const flaeche = el.livingSpace ? `${Math.round(el.livingSpace).toLocaleString("de-DE")} m²` : "—";
    return {
      id: el["@id"],
      titel: el.title ?? "Objekt",
      ort,
      typ,
      flaeche,
      href: `https://www.immobilienscout24.de/expose/${el["@id"]}`,
      src: BACKGROUNDS[i % BACKGROUNDS.length],
      span,
      imgClass,
    };
  });
}

function Tile({ listing, index, viewProperty }: { listing: Listing; index: number; viewProperty: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <a
      href={listing.href}
      target="_blank"
      rel="noopener noreferrer"
      ref={ref}
      onClick={() => posthog.capture("property_tile_clicked", {
        property_id: listing.id,
        property_title: listing.titel,
        property_type: listing.typ,
        property_location: listing.ort,
        property_area: listing.flaeche,
        position: index,
      })}
      className={`${listing.span} relative overflow-hidden rounded-2xl cursor-pointer block`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.7s ease ${index * 80}ms, transform 0.7s ease ${index * 80}ms`,
        minHeight: "240px",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Image src={listing.src} fill alt={listing.titel} className={`${listing.imgClass} transition-transform duration-700 ease-out ${hovered ? "scale-105" : "scale-100"}`} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity duration-500" style={{ opacity: hovered ? 1 : 0 }} />

      <div className="absolute bottom-5 left-5 transition-all duration-500" style={{ opacity: hovered ? 0 : 1, transform: hovered ? "translateY(6px)" : "translateY(0)" }}>
        <p className="text-foreground font-semibold text-lg leading-tight">{listing.titel}</p>
        <p className="text-white/60 text-xs uppercase tracking-widest mt-1">{listing.ort}</p>
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 transition-all duration-500" style={{ opacity: hovered ? 1 : 0, transform: hovered ? "translateY(0)" : "translateY(12px)" }}>
        <span className="text-accent text-xs uppercase tracking-widest font-semibold">{listing.typ}</span>
        <p className="text-foreground font-bold text-2xl text-center leading-tight">{listing.titel}</p>
        <p className="text-white/60 text-xs uppercase tracking-widest">{listing.ort}</p>
        <div className="w-8 h-px bg-accent/60 my-1" />
        <p className="text-white/80 text-sm">{listing.flaeche}</p>
        <span className="mt-2 px-5 py-2 border border-white/30 rounded-full text-white text-xs uppercase tracking-widest hover:border-accent hover:text-accent transition-colors duration-200">
          {viewProperty}
        </span>
      </div>
    </a>
  );
}

const SKELETON_SPANS = [
  "col-span-1 md:col-span-2 md:row-span-2",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 md:col-span-2",
  "col-span-1 md:row-span-2",
];

function SkeletonTile({ span }: { span: string }) {
  return (
    <div className={`${span} rounded-2xl overflow-hidden`} style={{ minHeight: "240px" }}>
      <div className="w-full h-full bg-white/5 relative overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/8 to-transparent" />
      </div>
    </div>
  );
}

function EmptyState({ noListings }: { noListings: string }) {
  return (
    <div className="col-span-1 sm:col-span-2 md:col-span-3 flex flex-col items-center justify-center py-24 gap-4">
      <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center">
        <svg className="w-5 h-5 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      </div>
      <p className="text-white/20 text-xs uppercase tracking-widest">{noListings}</p>
    </div>
  );
}

type GridDict = {
  viewProperty: string;
  notConnected: string;
  connectButton: string;
  noListings: string;
};

export default function ReferenzGrid({ viewProperty, notConnected, connectButton, noListings }: GridDict) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [unauthenticated, setUnauthenticated] = useState(false);

  useEffect(() => {
    fetch("/api/real-estates")
      .then((res) => {
        if (res.status === 401) { setUnauthenticated(true); return null; }
        return res.ok ? res.json() : null;
      })
      .then((data) => {
        if (!data) return;
        const elements = data["realestates.realEstates"]?.realEstateList?.realEstateElement;
        const arr: RawElement[] = Array.isArray(elements) ? elements : elements ? [elements] : [];
        setListings(parseListings(arr));
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  if (unauthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-6">
        <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center">
          <svg className="w-5 h-5 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <p className="text-white/30 text-xs uppercase tracking-widest">{notConnected}</p>
        <a
          href="/api/oauth/init"
          className="px-6 py-2.5 border border-white/20 rounded-full text-white/60 text-xs uppercase tracking-widest hover:border-accent hover:text-accent transition-colors duration-200"
        >
          {connectButton}
        </a>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3" style={{ gridAutoRows: "280px" }}>
        {SKELETON_SPANS.map((span, i) => (
          <SkeletonTile key={i} span={span} />
        ))}
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3" style={{ gridAutoRows: "280px" }}>
        <EmptyState noListings={noListings} />
      </div>
    );
  }

  return (
    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3" style={{ gridAutoRows: "280px" }}>
      {listings.map((listing, i) => (
        <Tile key={listing.id} listing={listing} index={i} viewProperty={viewProperty} />
      ))}
    </div>
  );
}
