"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import Image from "next/image";
import { getCalendlyMembers } from "@/app/actions/calendly";

type CalendlyDialogContextType = {
  openDialog: () => void;
  closeDialog: () => void;
};

const CalendlyDialogContext = createContext<CalendlyDialogContextType | undefined>(undefined);

export function useCalendlyDialog() {
  const context = useContext(CalendlyDialogContext);
  if (!context) {
    throw new Error("useCalendlyDialog must be used within a CalendlyDialogProvider");
  }
  return context;
}

export function CalendlyDialogProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const openDialog = async () => {
    setIsOpen(true);
    setCurrentIndex(0);
    if (members.length === 0) {
      setLoadingMembers(true);
      const fetchedMembers = await getCalendlyMembers();
      setMembers(fetchedMembers);
      setLoadingMembers(false);
    }
  };

  const closeDialog = () => setIsOpen(false);

  const N = members.length;
  // On mobile: 1 card visible (w-full) → step = 100%
  // On desktop: 2 cards visible (w-1/2) → step = 50%
  const step = isMobile ? 100 : 50;

  // On desktop (2 cards visible), stop 1 earlier so no empty slot appears
  const maxIndex = N > 0 ? (isMobile ? N - 1 : Math.max(0, N - 2)) : 0;

  const handleNext = () => {
    if (currentIndex < maxIndex) setCurrentIndex((i) => i + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  const renderCard = (m: any) => {
    const u = m.user;
    return (
      <a
        href={u.scheduling_url}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full group flex flex-col items-center bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-accent/50 transition-all duration-300 cursor-pointer relative overflow-hidden"
      >
        {u.avatar_url ? (
          <div className="relative w-28 h-28 rounded-full overflow-hidden mb-6 border-2 border-transparent group-hover:border-accent transition-colors duration-300">
            <Image src={u.avatar_url} alt={u.name} fill className="object-cover" />
          </div>
        ) : (
          <div className="w-28 h-28 rounded-full bg-white/10 flex items-center justify-center mb-6 border-2 border-transparent group-hover:border-accent transition-colors duration-300">
            <span className="text-3xl text-white/60">{u.name.charAt(0)}</span>
          </div>
        )}
        <h3 className="text-xl font-semibold text-foreground text-center mb-2">{u.name}</h3>
        <p className="text-sm text-white/50 mb-6">{u.email}</p>
        <div className="mt-auto px-6 py-2.5 rounded-full border border-white/20 text-white/80 text-xs uppercase tracking-widest group-hover:bg-accent group-hover:border-accent group-hover:text-background transition-colors duration-300">
          Termin vereinbaren
        </div>
      </a>
    );
  };

  return (
    <CalendlyDialogContext.Provider value={{ openDialog, closeDialog }}>
      {children}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-[fade-in_0.2s_ease-out_forwards]">
          <div className="relative w-full max-w-4xl bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 md:p-8 overflow-y-auto max-h-[95vh] md:max-h-[90vh] animate-[scale-in_0.3s_ease-out]">
            <button
              onClick={closeDialog}
              className="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer z-10"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mt-8 md:mt-0 mb-8 md:mb-10">
              <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4 uppercase">Schlüsselmoment erleben</h2>
              <p className="text-white/60 max-w-2xl mx-auto text-lg">Wählen Sie Ihren Ansprechpartner und vereinbaren Sie direkt einen Termin.</p>
            </div>

            {loadingMembers ? (
              <div className="w-full flex gap-4 py-4">
                {[0, 1].map((i) => (
                  <div key={i} className={`flex-col items-center bg-white/5 border border-white/10 rounded-2xl p-8 animate-pulse ${i === 1 ? "hidden md:flex flex-1" : "flex flex-1"}`}>
                    <div className="w-28 h-28 rounded-full bg-white/10 mb-6" />
                    <div className="h-6 w-32 bg-white/10 rounded-md mb-3" />
                    <div className="h-4 w-24 bg-white/10 rounded-md mb-8" />
                    <div className="mt-auto h-10 w-40 bg-white/10 rounded-full" />
                  </div>
                ))}
              </div>
            ) : N > 0 ? (
              <div className="relative flex items-center py-4">
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="absolute left-0 z-10 -ml-4 p-3 rounded-full bg-black/50 hover:bg-white/10 backdrop-blur-sm transition-colors border border-white/10 text-white/80 disabled:opacity-20 disabled:cursor-default disabled:hover:bg-transparent"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <div className="w-full overflow-hidden px-4">
                  <div
                    className="flex transition-transform duration-500 ease-out"
                    style={{ transform: `translateX(-${currentIndex * step}%)` }}
                  >
                    {members.map((m, i) => (
                      <div key={i} className="w-full md:w-1/2 shrink-0 px-2">
                        {renderCard(m)}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleNext}
                  disabled={currentIndex === maxIndex}
                  className="absolute right-0 z-10 -mr-4 p-3 rounded-full bg-black/50 hover:bg-white/10 backdrop-blur-sm transition-colors border border-white/10 text-white/80 disabled:opacity-20 disabled:cursor-default disabled:hover:bg-transparent"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </CalendlyDialogContext.Provider>
  );
}
