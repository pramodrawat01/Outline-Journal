import React from "react";
import { useState, useEffect } from "react";
import Header from "./Header";
import { Link } from "react-router-dom";
export default function Hero() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const gridSize = isMobile ? 36 : 56;
  return (
    <section className="relative">

      {/* grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize:  `${gridSize}px ${gridSize}px`,
          maskImage:
            "linear-gradient(to bottom, black 0%, black 60%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 60%, transparent 100%)",
        }}
      />

      {/* random-lit grid squares — snapped to the 56px grid so edges line up exactly */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { row: 0, col: 2, o: 0.12 },
          { row: 0, col: 21, o: 0.1 },
          { row: 1, col: 13, o: 0.1 },
          { row: 1, col: 5, o: 0.1 },
          { row: 2, col: 24, o: 0.15 },
          { row: 3, col: 1, o: 0.1 },
          { row: 4, col: 15, o: 0.08 },
          { row: 5, col: 8, o: 0.06 },
          { row: 6, col: 23, o: 0.12 },
          { row: 8, col: 17, o: 0.5 },
            { row: 11, col: 4, o: 0.3 },
        ].map((b, i) => (
          <div
            key={i}
            className="absolute bg-white"
            style={{
              top: b.row * gridSize,
              left: b.col * gridSize,
              width: gridSize,
              height: gridSize,
              opacity: b.o,
            }}
          />
        ))}
      </div>

      
      {/* Black gradient from top to bottom */}
        <div
        className="absolute inset-0"
        style={{
            background:
            "linear-gradient(to bottom, #0a0a0a 0%, rgba(10,10,10,0.65) 15%, rgba(10,10,10,0.2) 25%, transparent 100%)",
        }}
        />


      {/* green radial glow */}
      <div
        className="absolute left-1/2 top-[220px] -translate-x-1/2 w-[1500px] h-[900px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(closest-side, rgba(34,197,94,0.45), rgba(34,197,94,0.15) 50%, transparent 75%)",
          filter: "blur(50px)",
        }}
      />

      <Header />

      {/* HERO CONTENT */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 pb-16 max-w-3xl mx-auto pt-20">
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-xs text-gray-300 mb-4 ">
          <span>✍️</span> Now open — start your journal for free
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.1] mb-6">
          Every journey deserves
          <br />
          to be written down
        </h1>

        <p className="text-gray-400 text-sm md:text-base max-w-xl mb-8 leading-relaxed">
          Outline is a quiet place to document your life as it happens — your
          career, your fitness, your projects, your growth. Create a profile,
          write your first entry, and share your journey when you're ready.
        </p>

        <div className="flex items-center gap-3">
          <Link to="/create-blog">
            <button className="bg-emerald-500 hover:bg-emerald-400 transition-colors cursor-pointer text-black text-sm font-medium px-6 py-3 rounded-full">
              Start your journal
            </button>
          </Link>
          <Link to="/blogs">
            <button className="rounded-full border border-white/10 bg-[#202923] px-6 py-3 cursor-pointer text-sm font-medium text-white transition-colors hover:bg-[#29352d]">
              Read journals
            </button>
          </Link>
        </div>
      </div>

      {/* BROWSER MOCKUP — a peek at the writing editor */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 pb-2">
        <div className="rounded-2xl border border-white/10 bg-[#101410]/90 backdrop-blur-sm shadow-2xl overflow-hidden">
          {/* top bar */}
          <div className="flex items-center gap-4 px-5 py-4 border-b border-white/5">
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-400">✦</span>
              <span className="text-sm font-medium">Outline</span>
            </div>
            <div className="flex-1 h-3 rounded-full bg-white/10 max-w-xs" />
            <div className="flex items-center gap-2 ml-auto">
              <span className="w-3 h-3 rounded-full bg-white/15" />
              <span className="w-3 h-3 rounded-full bg-white/15" />
              <span className="w-14 h-3 rounded-full bg-white/10" />
            </div>
          </div>

          {/* body */}
          <div className="flex gap-4 p-5">
            {/* sidebar */}
            <div className="hidden sm:flex flex-col gap-4 w-10 pt-2">
              <span className="w-3 h-3 rounded-full bg-white/15" />
              <span className="w-3 h-3 rounded-full bg-white/15" />
              <span className="w-3 h-3 rounded-full bg-white/15" />
              <span className="w-3 h-3 rounded-full bg-white/15" />
            </div>

            {/* content cards — mock entry titles */}
            <div className="flex-1 grid grid-cols-3 gap-3">
              {["Day 1 of learning to code", "Week 12 of marathon training", "Building my first startup"].map(
                (title, i) => (
                  <div
                    key={i}
                    className="bg-white/5 rounded-xl p-4 h-28 flex flex-col gap-2 text-left"
                  >
                    <div className="h-2.5 w-3/4 rounded-full bg-white/15" />
                    <div className="h-2.5 w-1/2 rounded-full bg-white/10" />
                    <div className="h-2.5 w-2/3 rounded-full bg-white/10" />
                    <span className="mt-auto text-[10px] text-gray-500 truncate">
                      {title}
                    </span>
                  </div>
                )
              )}
              <div className="col-span-3 bg-white/5 rounded-xl h-16" />
            </div>
          </div>
        </div>
      </div>
     

    </section>
  );
}