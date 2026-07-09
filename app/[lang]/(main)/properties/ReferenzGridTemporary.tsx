"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { trackEvent } from "@/lib/event-tracker";
import CalendlyButton from "@/components/CalendlyButton";

type Listing = {
  id: string;
  titel: string;
  ort: string;
  typ: string;
  flaeche: string;
  href: string;
  images: string[];
  span: string;
  imgClass: string;
  // Grid position where the details panel should appear (overlays a companion tile)
  detailsPosition: string;
  imagePositions?: Record<number, string>;
};

// Static layout data — no translatable text here
// Grid layout (3 cols, auto rows):
// Row 1-2: [0] (cols 1-2, row-span-2) | [1] (col 3, row 1) | [2] (col 3, row 2)
// Row 3:   [3] (col 1)                | [4] (cols 2-3)
// Row 4-5: [5] (col 1, row-span-2)    | [6] (cols 2-3, row 4) | CTA (cols 2-3, row 5)
const STATIC_DATA = [
  {
    images: ["/properties/0/0.jpg","/properties/0/1.jpg","/properties/0/2.jpg","/properties/0/3.jpg","/properties/0/4.jpg","/properties/0/5.jpg","/properties/0/6.jpg","/properties/0/7.jpg","/properties/0/8.jpg"],
    href: "#", span: "col-span-1 lg:col-span-2 lg:row-span-2",
    imgClass: "object-cover object-[25%_center]",
    detailsPosition: "col-start-3 row-start-1 row-span-2",
  },
  {
    images: ["/properties/1/0.jpg","/properties/1/1.jpg","/properties/1/2.jpg","/properties/1/3.jpg","/properties/1/4.jpg"],
    href: "#", span: "col-span-1 row-span-1",
    imgClass: "object-cover object-center",
    detailsPosition: "col-start-1 col-span-2 row-start-1 row-span-2",
  },
  {
    images: ["/properties/2/0.jpg","/properties/2/1.jpg","/properties/2/2.jpg","/properties/2/3.jpg","/properties/2/4.jpg","/properties/2/5.jpg"],
    href: "#", span: "col-span-1 row-span-1",
    imgClass: "object-cover object-top",
    detailsPosition: "col-start-1 col-span-2 row-start-1 row-span-2",
  },
  {
    images: ["/properties/6/0.jpg","/properties/6/1.jpg","/properties/6/2.jpg"],
    href: "#", span: "col-span-1 row-span-1",
    imgClass: "object-cover object-center",
    detailsPosition: "col-start-2 col-span-2 row-start-3",
  },
  {
    images: ["/properties/3/0.jpg","/properties/3/1.jpg","/properties/3/2.jpg","/properties/3/3.jpg","/properties/3/4.jpg"],
    href: "#", span: "col-span-1 lg:col-span-2",
    imgClass: "object-cover object-[25%_40%]",
    detailsPosition: "col-start-1 col-span-1 row-start-3",
    imagePositions: { 1: "40% 31%" } as Record<number, string>,
  },
  {
    images: ["/properties/5/0.jpg","/properties/5/3.jpg","/properties/5/2.jpg","/properties/5/4.jpg","/properties/5/5.jpg"],
    href: "#", span: "col-span-1 lg:row-span-2",
    imgClass: "object-cover object-center",
    detailsPosition: "col-start-2 col-span-2 row-start-4",
  },
  {
    images: ["/properties/4/0.jpg","/properties/4/1.jpg","/properties/4/2.jpg"],
    href: "#", span: "col-span-1 lg:col-span-2",
    imgClass: "object-cover object-[30%_70%]",
    detailsPosition: "col-start-1 col-span-1 row-start-4 row-span-2",
    imagePositions: { 0: "30% 35%", 1: "40% 40%", 2: "30% 48%" } as Record<number, string>,
  },
];

const SKELETON_SPANS = STATIC_DATA.map((d) => d.span);

function Tile({ listing, index, onHoverChange, labelOrt, labelTyp, labelFlaeche }: { listing: Listing; index: number; onHoverChange?: (hovered: boolean) => void; labelOrt: string; labelTyp: string; labelFlaeche: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [mobileInfoOpen, setMobileInfoOpen] = useState(false);

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

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImage((prev) => (prev + 1) % listing.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImage((prev) => (prev - 1 + listing.images.length) % listing.images.length);
  };

  return (
    <a
      href={listing.href}
      target="_blank"
      rel="noopener noreferrer"
      ref={ref}
      onClick={(e) => {
        if (listing.href === "#") e.preventDefault();
        trackEvent("property_tile_clicked", {
          property_id: listing.id,
          property_title: listing.titel,
          property_type: listing.typ,
          property_location: listing.ort,
          property_area: listing.flaeche,
          position: index,
        }, {
          metaEventName: 'ViewContent',
          customData: {
            contentIds: [listing.id],
            contentName: listing.titel,
            contentCategory: listing.typ,
            property_location: listing.ort,
            property_area: listing.flaeche,
            position: index,
          }
        });
      }}
      className={`${listing.span} relative overflow-hidden rounded-2xl cursor-default block`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.7s ease ${index * 80}ms, transform 0.7s ease ${index * 80}ms`,
        minHeight: "240px",
      }}
      onMouseEnter={() => { setHovered(true); onHoverChange?.(true); }}
      onMouseLeave={() => { setHovered(false); onHoverChange?.(false); }}
    >
      <div className="absolute inset-0 w-full h-full">
        {listing.images.map((img, i) => (
          <Image
            key={img}
            src={img}
            fill
            sizes="(max-width: 1024px) 100vw, 66vw"
            alt={`${listing.titel} - Bild ${i + 1}`}
            className={`${listing.imgClass} absolute inset-0`}
            style={{
              opacity: currentImage === i ? 1 : 0,
              transform: hovered && currentImage === i ? "scale(1.05)" : "scale(1)",
              transition: "opacity 0.5s ease, transform 0.7s ease-out",
              ...(listing.imagePositions?.[i] ? { objectPosition: listing.imagePositions[i] } : {}),
            }}
          />
        ))}
        {listing.images.length > 1 && (
          <div className="absolute bottom-5 right-5 z-20 flex gap-2">
            <button
              onClick={prevImage}
              className="p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors backdrop-blur-sm cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextImage}
              className="p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors backdrop-blur-sm cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-5 left-5 z-20">
        <p className="text-foreground font-semibold text-lg leading-tight">{listing.titel}</p>
        <p className="text-white/60 text-xs uppercase tracking-widest mt-1">{listing.ort}</p>
      </div>

      {/* Info button — mobile only */}
      <button
        className="lg:hidden absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center cursor-pointer"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMobileInfoOpen(true); }}
      >
        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 110 20A10 10 0 0112 2z" />
        </svg>
      </button>

      {/* Mobile info overlay — over the same tile */}
      <div
        className="lg:hidden absolute inset-0 z-40 flex flex-col items-start justify-center p-6 bg-black/85 backdrop-blur-md rounded-2xl transition-opacity duration-300 pointer-events-none"
        style={{ opacity: mobileInfoOpen ? 1 : 0 }}
      >
        {mobileInfoOpen && (
          <button
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center cursor-pointer pointer-events-auto"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMobileInfoOpen(false); }}
          >
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        <h3 className="text-accent text-xs uppercase tracking-widest font-semibold mb-2">Details</h3>
        <p className="text-foreground font-bold text-xl mb-3 leading-tight">{listing.titel}</p>
        <p className="text-white/80 text-sm mb-1">{labelOrt}: {listing.ort}</p>
        <p className="text-white/80 text-sm mb-1">{labelTyp}: {listing.typ}</p>
        <p className="text-white/80 text-sm mb-4">{labelFlaeche}: {listing.flaeche}</p>
        <div className="w-8 h-px bg-accent/60" />
      </div>

      <div
        className="absolute inset-0 rounded-2xl ring-1 ring-white/20 transition-opacity duration-300 pointer-events-none z-20"
        style={{ opacity: hovered ? 1 : 0 }}
      />
    </a>
  );
}

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

type ListingText = { title: string; ort: string; typ: string; flaeche: string };

type GridDict = {
  viewProperty: string;
  notConnected: string;
  connectButton: string;
  noListings: string;
  ctaHeading: string;
  ctaButton: string;
  labelOrt: string;
  labelTyp: string;
  labelFlaeche: string;
  listingsData: ListingText[];
};

export default function ReferenzGridTemporary({ viewProperty, notConnected, connectButton, noListings, ctaHeading, ctaButton, labelOrt, labelTyp, labelFlaeche, listingsData }: GridDict) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredListing, setHoveredListing] = useState<Listing | null>(null);

  useEffect(() => {
    const merged: Listing[] = STATIC_DATA.map((s, i) => ({
      id: `prop-${i}`,
      titel: listingsData[i]?.title ?? "",
      ort: listingsData[i]?.ort ?? "",
      typ: listingsData[i]?.typ ?? "",
      flaeche: listingsData[i]?.flaeche ?? "",
      href: s.href,
      images: s.images,
      span: s.span,
      imgClass: s.imgClass,
      detailsPosition: s.detailsPosition,
      imagePositions: s.imagePositions,
    }));
    const timer = setTimeout(() => {
      setListings(merged);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [listingsData]);

  if (loading) {
    return (
      <div className="grid gap-3 grid-cols-1 lg:grid-cols-3" style={{ gridAutoRows: "280px" }}>
        {SKELETON_SPANS.map((span, i) => (
          <SkeletonTile key={i} span={span} />
        ))}
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="grid gap-3 grid-cols-1 lg:grid-cols-3" style={{ gridAutoRows: "280px" }}>
        <EmptyState noListings={noListings} />
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Main grid */}
      <div className="grid gap-3 grid-cols-1 lg:grid-cols-3" style={{ gridAutoRows: "280px" }}>
        {listings.map((listing, i) => (
          <Tile
            key={listing.id}
            listing={listing}
            index={i}
            onHoverChange={(isHovered) => setHoveredListing(isHovered ? listing : null)}
            labelOrt={labelOrt}
            labelTyp={labelTyp}
            labelFlaeche={labelFlaeche}
          />
        ))}

        <div className="col-span-1 lg:col-span-2 relative overflow-hidden rounded-2xl flex flex-col items-center justify-center p-8 text-center border border-white/10 bg-white/5">
          <p className="text-2xl md:text-3xl font-semibold text-foreground mb-8 max-w-md leading-relaxed">
            {ctaHeading}
          </p>
          <CalendlyButton trackSource="referenz_grid_temporary">
            {ctaButton}
          </CalendlyButton>
        </div>
      </div>

      {/* Overlay grid — same config, sits on top, no DOM changes on hover */}
      <div
        className="absolute inset-0 hidden lg:grid gap-3 grid-cols-3 pointer-events-none"
        style={{ gridAutoRows: "280px" }}
      >
        {listings.map((listing) => (
          <div
            key={listing.id}
            className={`relative overflow-hidden flex flex-col items-start justify-center p-8 rounded-2xl text-left border border-white/20 transition-opacity duration-300 ${listing.detailsPosition}`}
            style={{ opacity: hoveredListing?.id === listing.id ? 1 : 0 }}
          >
            <Image src="/backgrounds/facade.png" fill sizes="(max-width: 1024px) 100vw, 66vw" alt="" className="object-cover object-center" />
            <div className="absolute inset-0 bg-black/70" />
            <div className="relative z-10 flex flex-col items-start">
              <h3 className="text-accent text-sm uppercase tracking-widest font-semibold mb-2">Details</h3>
              <p className="text-foreground font-bold text-2xl mb-4 leading-tight">{listing.titel}</p>
              <p className="text-white/80 mb-2">{labelOrt}: {listing.ort}</p>
              <p className="text-white/80 mb-2">{labelTyp}: {listing.typ}</p>
              <p className="text-white/80 mb-4">{labelFlaeche}: {listing.flaeche}</p>
              <div className="w-8 h-px bg-accent/60" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
