"use client";

import { createContext, useContext, useState, ReactNode } from "react";
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

  const openDialog = async () => {
    setIsOpen(true);
    if (members.length === 0) {
      setLoadingMembers(true);
      const fetchedMembers = await getCalendlyMembers();
      setMembers(fetchedMembers);
      setLoadingMembers(false);
    }
  };

  const closeDialog = () => setIsOpen(false);

  return (
    <CalendlyDialogContext.Provider value={{ openDialog, closeDialog }}>
      {children}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-[fade-in_0.2s_ease-out_forwards]">
          <div className="relative w-full max-w-5xl bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 overflow-y-auto max-h-[90vh] animate-[scale-in_0.3s_ease-out]">
            <button
              onClick={closeDialog}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-colors cursor-pointer z-10"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 uppercase">Schlüsselmoment erleben</h2>
              <p className="text-white/60 max-w-2xl mx-auto text-lg">Wählen Sie einen Ansprechpartner und vereinbaren Sie direkt einen Termin.</p>
            </div>

            {loadingMembers ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center bg-white/5 border border-white/10 rounded-2xl p-8 relative overflow-hidden animate-pulse"
                  >
                    <div className="w-28 h-28 rounded-full bg-white/10 mb-6" />
                    <div className="h-6 w-32 bg-white/10 rounded-md mb-3" />
                    <div className="h-4 w-24 bg-white/10 rounded-md mb-8" />
                    <div className="mt-auto h-10 w-40 bg-white/10 rounded-full" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {members.map((m: any, i: number) => {
                  const u = m.user;
                  return (
                    <a
                      key={i}
                      href={u.scheduling_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col items-center bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-accent/50 transition-all duration-300 cursor-pointer relative overflow-hidden"
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
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </CalendlyDialogContext.Provider>
  );
}
