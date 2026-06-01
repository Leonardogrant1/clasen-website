"use client";

import { useEffect } from "react";

export default function HashScrollHandler() {
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    const id = hash.slice(1);

    // If already in DOM, scroll immediately
    const existing = document.getElementById(id);
    if (existing) {
      existing.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    // Otherwise wait for it to appear via MutationObserver
    const observer = new MutationObserver(() => {
      const el = document.getElementById(id);
      if (el) {
        observer.disconnect();
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Safety timeout after 5s
    const timeout = setTimeout(() => observer.disconnect(), 5000);

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, []);

  return null;
}
