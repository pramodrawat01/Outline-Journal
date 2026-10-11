import React from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const entries = [
  {
    tag: "Career change",
    title: "Leaving law for design, one entry at a time",
    excerpt:
      "Six months ago I quit my job at a law firm. Here's the honest, unfiltered account of what happened next.",
    author: "Meera K.",
    day: "Day 182",
    image:
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=600&q=80",
  },
  {
    tag: "Fitness",
    title: "Couch to marathon: the full log",
    excerpt:
      "Every run, every setback, every small win on the way from zero to 42 kilometers.",
    author: "Daniel O.",
    day: "Week 34",
    image:
      "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?auto=format&fit=crop&w=600&q=80",
  },
  {
    tag: "Building",
    title: "Building a startup with no funding",
    excerpt:
      "The real numbers, the real doubts, and what it actually takes to ship a first version alone.",
    author: "Priya S.",
    day: "Entry 47",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80",
  },
];

export default function ExplorePreview() {
  return (
    <section id="explore" className="max-w-6xl mx-auto px-6 py-20">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
        <div className="max-w-xl">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            Journeys people are writing right now
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            A small sample of the journals published on Outline this week.
          </p>
        </div>
        <Link to="/blogs" className="cursor-pointer">
          <button className="flex items-center gap-1 text-sm text-emerald-400 hover:text-emerald-300 transition-colors shrink-0">
            Explore all journals <ArrowUpRight size={16} />
          </button>
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {entries.map((entry, i) => (
          <div
            key={i}
            className="bg-[#111511] border border-white/5 rounded-2xl overflow-hidden group cursor-pointer"
          >
            <div className="h-44 overflow-hidden">
              <img
                src={entry.image}
                alt={entry.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-6">
              <span className="text-xs text-emerald-400 border border-emerald-500/20 bg-emerald-500/10 rounded-full px-3 py-1">
                {entry.tag}
              </span>
              <h3 className="font-semibold text-lg mt-4 mb-2 leading-snug">
                {entry.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                {entry.excerpt}
              </p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{entry.author}</span>
                <span>{entry.day}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}