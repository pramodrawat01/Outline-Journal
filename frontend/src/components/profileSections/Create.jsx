import React, { useState } from "react";
import { TrendingUp, Heart, Clock, Eye, Plus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const trendingBlogs = [
  { title: "Why Remote Work is Here to Stay", author: "Sam Lee", meta: "15 min read", tag: "Popular" },
  { title: "The Minimalist Approach to Life", author: "Mia Chen", meta: "6 min read", tag: "New" },
  { title: "Building Lasting Habits", author: "Alex Rivera", meta: "11 min read", tag: "Popular" },
];

const topAuthors = [
  { name: "Elena Voss", followers: "42k followers" },
  { name: "Sam Lee", followers: "28k followers" },
  { name: "Mia Chen", followers: "19k followers" },
];

const tabs = ["All", "Popular", "New", "Following"];

export default function Create () {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("All");

  return (
    <div className="flex flex-col gap-6">
     

      {/* tabs */}
      <div className="flex items-center gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-sm font-medium px-4 py-2 rounded-full transition-colors ${
              activeTab === tab
                ? "bg-emerald-500 text-black"
                : "bg-white/5 border border-white/10 text-gray-400 hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* trending post — spans 2 columns */}
        <div className="lg:col-span-2 bg-[#111511] border border-white/5 rounded-2xl p-6">
          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1 mb-4">
            <TrendingUp size={12} />
            Trending
          </span>

          <h2 className="text-2xl font-semibold leading-snug mb-3">
            Unlocking Creativity Through Daily Journaling
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-5">
            Discover how consistent journaling can transform your creative
            process and help you capture ideas that matter.
          </p>

          <div className="rounded-xl overflow-hidden mb-5 h-56">
            <img
              src="https://images.unsplash.com/photo-1517971071642-34a2d3ecc9cd?auto=format&fit=crop&w=900&q=80"
              alt="Journal, coffee, and laptop on a desk"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-medium">
                E
              </div>
              <div className="text-sm">
                <p className="font-medium leading-none">Elena Voss</p>
                <p className="text-xs text-gray-500 mt-1">8 min read · 12.4k views</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-400">
              <Heart size={14} />
              2.3k
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="bg-emerald-500 hover:bg-emerald-400 transition-colors text-black text-sm font-medium px-5 py-2.5 rounded-full">
              Read now
            </button>
            <button className="bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-sm font-medium px-5 py-2.5 rounded-full">
              Save for later
            </button>
          </div>
        </div>

        {/* right column: trending blogs + top authors */}
        <div className="flex flex-col gap-6">
          <div className="bg-[#111511] border border-white/5 rounded-2xl p-6">
            <h3 className="font-semibold mb-1">Trending blogs</h3>
            <p className="text-xs text-gray-500 mb-4">Most read this week</p>
            <div className="flex flex-col gap-4">
              {trendingBlogs.map((blog, i) => (
                <div key={i} className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium leading-snug">{blog.title}</p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <Clock size={11} />
                      {blog.author} · {blog.meta}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-medium px-2 py-1 rounded-full shrink-0 ${
                      blog.tag === "New"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-white/5 text-gray-400 border border-white/10"
                    }`}
                  >
                    {blog.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#111511] border border-white/5 rounded-2xl p-6">
            <h3 className="font-semibold mb-1">Top authors</h3>
            <p className="text-xs text-gray-500 mb-4">Follow inspiring writers</p>
            <div className="flex flex-col gap-4">
              {topAuthors.map((author, i) => (
                <div key={i} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-medium shrink-0">
                      {author.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none">{author.name}</p>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <Eye size={11} />
                        {author.followers}
                      </p>
                    </div>
                  </div>
                  <button className="text-xs font-medium bg-white/5 hover:bg-white/10 border border-white/10 transition-colors rounded-full px-3 py-1.5">
                    Follow
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}