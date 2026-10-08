import React from "react";

const testimonials = [
  {
    quote:
      "I tried keeping a private notebook for years and never stuck with it. Something about knowing a few people might read it keeps me writing every week.",
    name: "Meera Kapoor",
    role: "Documenting a career change",
    img: "https://i.pravatar.cc/80?img=32",
  },
  {
    quote:
      "Outline is the only app I've used where writing feels like the whole point. No likes counter, no algorithm — just my entries, in order.",
    name: "Daniel Osei",
    role: "Marathon training log",
    img: "https://i.pravatar.cc/80?img=15",
  },
  {
    quote:
      "Being able to keep early entries private saved me. I could write honestly about the startup failing before I was ready to share it.",
    name: "Priya Sharma",
    role: "Building in public",
    img: "https://i.pravatar.cc/80?img=47",
  },
];

export default function Testimonials() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <div className="text-center max-w-xl mx-auto mb-14">
        <h2 className="text-3xl md:text-4xl font-semibold mb-4">
          Why people keep coming back to write
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed">
          Outline is built around one habit: showing up and writing the next
          entry. Here's what that's done for a few of our writers.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {testimonials.map((t, i) => (
          <div
            key={i}
            className="bg-[#111511] border border-white/5 rounded-2xl p-8 flex flex-col justify-between"
          >
            <p className="text-gray-300 text-sm leading-relaxed mb-8">
              "{t.quote}"
            </p>
            <div className="flex items-center gap-3">
              <img
                src={t.img}
                alt={t.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <div className="text-sm font-medium">{t.name}</div>
                <div className="text-xs text-gray-500">{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}