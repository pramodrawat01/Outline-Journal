import React from "react";
import { UserPlus, NotebookPen, Share2 } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Create your profile",
    description:
      "Sign up in a minute and set up a profile for the journey you want to document — a career change, a fitness goal, a new project.",
  },
  {
    number: "02",
    icon: NotebookPen,
    title: "Write your first entry",
    description:
      "Open the editor and write. No templates to fill in, no pressure to be polished — just get today's entry down.",
  },
  {
    number: "03",
    icon: Share2,
    title: "Share your journey",
    description:
      "Keep entries private, publish a few, or open your whole journal to the world. You decide what's shared and when.",
  },
];

export default function HowItWorks() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <div className="text-center max-w-xl mx-auto mb-14">
        <h2 className="text-3xl md:text-4xl font-semibold mb-4">
          Start documenting in three steps
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed">
          Outline is built to get out of the way. From sign-up to your first
          published entry takes less time than reading this page.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {steps.map((step, i) => (
          <div
            key={i}
            className="relative bg-[#111511] border border-white/5 rounded-2xl p-8"
          >
            <span className="text-5xl font-semibold text-white/5 absolute top-4 right-6 select-none">
              {step.number}
            </span>
            <div className="w-11 h-11 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
              <step.icon size={18} className="text-emerald-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}