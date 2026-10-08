import React from "react";

export default function CTA() {
  return (
    <section className="max-w-6xl mx-auto px-6 pb-24">
      <div
        className="relative rounded-2xl overflow-hidden px-8 py-16 md:py-20 text-center"
        style={{
          background: "linear-gradient(135deg, #16a34a 0%, #15803d 55%, #0f3d24 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.3) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "radial-gradient(circle at center, black, transparent 75%)",
            WebkitMaskImage: "radial-gradient(circle at center, black, transparent 75%)",
          }}
        />
        <h2 className="relative text-3xl md:text-4xl font-semibold mb-4 max-w-xl mx-auto">
          Your journey is already happening. Start writing it down.
        </h2>
        <p className="relative text-white/80 text-sm max-w-md mx-auto mb-8">
          Free to start, no credit card needed. Your first entry takes less
          than two minutes to write.
        </p>
        <div className="relative flex items-center justify-center gap-3">
          <button className="bg-black text-white hover:bg-gray-900 transition-colors text-sm font-medium px-6 py-3 rounded-full">
            Create your free account
          </button>
          <button className="bg-white/10 hover:bg-white/20 transition-colors text-white text-sm font-medium px-6 py-3 rounded-full border border-white/20">
            See how it works
          </button>
        </div>
      </div>
    </section>
  );
}