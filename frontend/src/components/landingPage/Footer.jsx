import React from "react";
import { FaTwitter, FaInstagram, FaGithub } from "react-icons/fa6";


const columns = [
  {
    title: "Product",
    links: ["Explore journals", "Write an entry", "Pricing", "Mobile app"],
  },
  // {
  //   title: "Company",
  //   links: ["About", "Careers", "Press", "Contact"],
  // },
  {
    title: "Resources",
    links: ["About","Writing prompts", "Help center", "Community guidelines"],
  },
  {
    title: "Legal",
    links: ["Privacy policy", "Terms of service", "Cookie policy"],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#0a0d0b]">
      <div className="max-w-6xl mx-auto px-3 md:px-6 py-16">
        <div className="grid grid-col-1 md:grid-cols-2 gap-10 mb-14">
          {/* brand + newsletter */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-emerald-400 text-xl">✦</span>
              <span className="font-semibold text-lg tracking-tight">
                Outline
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              A quiet place to document your journey, one entry at a time.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex items-center gap-2 w-full"
            >
              <input
                type="email"
                placeholder="you@email.com"
                className="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500/50 w-full max-w-[280px] md:max-w-[330px]"
              />
              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-400 transition-colors text-black text-sm font-medium px-6 py-2 rounded-full shrink-0"
              >
                Join
              </button>
            </form>
          </div>
<div className="grid grid-cols-2 sm:grid-cols-3 gap-y-8">

          {columns.map((col, i) => (
            <div key={i}>
              <h4 className="text-sm font-medium mb-4 text-white">
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((link, j) => (
                  <li key={j}>
                    <a
                      href="#"
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
</div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5 text-sm text-gray-500">
          <span>© {new Date().getFullYear()} Outline. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-white transition-colors">
              <FaTwitter size={16} />
            </a>
            <a href="#" className="hover:text-white transition-colors">
              <FaInstagram size={16} />
            </a>
            <a href="#" className="hover:text-white transition-colors">
              <FaGithub size={16} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}