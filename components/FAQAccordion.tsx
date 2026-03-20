// components/FAQAccordion.tsx
// ─── Client component ─────────────────────────────────────────────────────────
// Tiny component for accordion state. CSS-only height transition.
// UPDATED: Dark Clinical HUD Theme
// ─────────────────────────────────────────────────────────────────────────────
"use client";

import React, { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-4 text-left">
      {items.map((item, i) => (
        <div key={i} className="border border-white/5 bg-white/5 backdrop-blur-sm">
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full text-left p-6 flex justify-between items-center hover:bg-white/5 transition-colors group"
            aria-expanded={openIndex === i}
          >
            <h4 className="text-sm font-black uppercase tracking-widest text-white/80 pr-4 group-hover:text-white transition-colors">
              {item.question}
            </h4>
            {/* Pure CSS icon — no lucide needed */}
            <span
              className="text-red-500 font-bold text-xl shrink-0 select-none transition-transform duration-200"
              style={{ transform: openIndex === i ? "rotate(45deg)" : "none" }}
              aria-hidden
            >
              +
            </span>
          </button>

          {/* Height transition without Framer Motion — pure CSS */}
          <div
            style={{
              maxHeight: openIndex === i ? "200px" : "0",
              overflow: "hidden",
              transition: "max-height 0.25s ease",
            }}
          >
            <div className="p-6 pt-0 text-sm font-medium text-white/50 leading-relaxed">
              {item.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
