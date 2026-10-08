import React from "react";

const categories = [
  "Career changes",
  "Fitness journeys",
  "Building startups",
  "Learning to code",
  "Travel diaries",
  "Mental health",
];

export default function LogoStrip() {
  return (
    <section className="border-y border-white/5 bg-[#0a0d0b] relative">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <p className="text-center text-xs uppercase tracking-widest text-gray-500 mb-6">
          People are already documenting
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {categories.map((c, i) => (
            <span
              key={i}
              className="text-sm text-gray-300 border border-white/10 bg-white/5 rounded-full px-4 py-1.5"
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}