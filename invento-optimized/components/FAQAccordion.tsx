// components/FAQAccordion.tsx
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
        <div key={i} className="border border-[#1A1A1A]/5 bg-white">
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full text-left p-6 flex justify-between items-center hover:bg-[#1A1A1A]/5 transition-colors"
            aria-expanded={openIndex === i}
          >
            <h4 className="text-sm font-black uppercase tracking-widest text-[#1A1A1A] pr-4">
              {item.question}
            </h4>
            {/* Pure CSS icon — no lucide needed */}
            <span
              className="text-[#8B0000] font-bold text-xl shrink-0 select-none transition-transform duration-200"
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
            <div className="p-6 pt-0 text-sm font-medium text-[#1A1A1A]/60 leading-relaxed">
              {item.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
