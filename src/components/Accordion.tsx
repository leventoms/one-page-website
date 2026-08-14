'use client';

import { useState } from 'react';

interface FaqItem {
  question: string;
  answer: string;
}

export default function Accordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="divide-y divide-plum-line border-y border-plum-line">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={item.question}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center justify-between py-5 text-left"
              aria-expanded={isOpen}
            >
              <span className="font-display font-semibold text-ivory">{item.question}</span>
              <span className="text-ivory-muted text-xl leading-none">{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen && (
              <p className="pb-5 text-ivory-muted text-sm leading-relaxed max-w-2xl">
                {item.answer}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
