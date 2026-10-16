import React from "react";
import { Play } from "lucide-react";

export default function Features() {
  return (
    <section className="max-w-6xl mx-auto px-3 md:px-6 py-20">
      <div className="text-center max-w-xl mx-auto mb-14">
        <h2 className="text-3xl md:text-4xl font-semibold mb-4">
          Everything you need to keep writing
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed">
          A distraction-free editor, a profile that grows with you, and full
          control over what stays private and what you share. Outline gets
          out of the way so you can focus on the writing.
        </p>
      </div>

      {/* top row: green card + video card */}
      <div className="grid md:grid-cols-2 gap-5 mb-5">
        {/* green feature card */}
        <div
          className="relative rounded-2xl p-8 flex flex-col justify-end min-h-[320px] overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #16a34a 0%, #15803d 60%, #0f3d24 100%)",
          }}
        >
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.3) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
              maskImage: "radial-gradient(circle at top left, black, transparent 70%)",
              WebkitMaskImage: "radial-gradient(circle at top left, black, transparent 70%)",
            }}
          />
          <span className="absolute top-6 left-6 bg-black/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full">
            Your profile
          </span>
          <h3 className="relative text-2xl font-semibold mb-2 leading-snug">
            Build a public journal of
            <br />
            your journey
          </h3>
          <p className="relative text-white/80 text-sm max-w-sm">
            Every entry lives on your profile in one timeline, so anyone can
            follow your story from day one to today.
          </p>
        </div>

        {/* video card */}
        <div className="relative rounded-2xl overflow-hidden min-h-[320px] bg-gray-800">
          <img
            src="https://images.unsplash.com/photo-1516414447565-b14be0adf13e?auto=format&fit=crop&w=900&q=80"
            alt="Person writing in a journal"
            className="w-full h-full object-cover absolute inset-0"
          />
          <div className="absolute inset-0 bg-black/20" />
          <button className="absolute inset-0 flex items-center justify-center group">
            <span className="w-16 h-16 rounded-full bg-white/90 group-hover:bg-white flex items-center justify-center transition-colors">
              <Play size={22} className="text-black ml-1" fill="black" />
            </span>
          </button>
          <div className="absolute bottom-5 left-5 right-5">
            <p className="text-sm text-white/90 font-medium">
              See how writers use Outline to document their journeys
            </p>
          </div>
        </div>
      </div>

      {/* bottom row: 3 stat cards */}
      <div className="grid md:grid-cols-3 gap-5">
        {/* published notification */}
        <div className="bg-[#111511] border border-white/5 rounded-2xl p-6 flex flex-col justify-between min-h-[230px]">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 w-fit text-xs">
            <span className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-black text-[10px]">
              ✓
            </span>
            <div className="text-left leading-tight">
              <div className="font-medium">Entry published</div>
              <div className="text-gray-500 text-[10px]">Today, 09:24</div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-lg mb-1">Write at your own pace</h4>
            <p className="text-gray-400 text-xs leading-relaxed">
              Save drafts, publish when it feels right, and edit entries any
              time — there's no schedule to keep up with.
            </p>
          </div>
        </div>

        {/* bar chart / streak */}
        <div className="bg-[#111511] border border-white/5 rounded-2xl p-6 flex flex-col justify-between min-h-[230px]">
          <div className="flex items-end gap-1 h-20">
            {[40, 55, 35, 70, 50, 65, 45, 80, 60, 75, 50, 90, 65, 55, 85].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-full bg-emerald-500"
                style={{ height: `${h}%`, opacity: 0.5 + h / 200 }}
              />
            ))}
          </div>
          <div>
            <div className="text-4xl font-semibold mt-4">28-day</div>
            <p className="text-gray-400 text-xs mt-1">Longest writing streak this month</p>
          </div>
        </div>

        {/* community + privacy */}
        <div className="flex flex-col gap-5">
          <div className="bg-[#111511] border border-white/5 rounded-2xl p-6 flex flex-col sm:flex-row md:flex-col items-center gap-3">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <img
                  key={i}
                  src={`https://i.pravatar.cc/40?img=${i + 10}`}
                  alt="writer avatar"
                  className="w-8 h-8 rounded-full border-2 border-[#111511]"
                />
              ))}
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">
              Writers on Outline span every timezone, all documenting their
              own kind of journey.
            </p>
          </div>

          <div
            className="rounded-2xl p-6 flex-1"
            style={{ background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)" }}
          >
            <h4 className="font-semibold mb-1">Private by default</h4>
            <p className="text-white/80 text-xs leading-relaxed">
              Every entry starts private. Publish individual entries or your
              whole journal only when you choose to.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}