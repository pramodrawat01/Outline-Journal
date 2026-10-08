import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, FileText, BookOpen, ArrowRight } from "lucide-react";

const entryTypes = [
  {
    key: "blog",
    label: "Blog Post",
    icon: FileText,
    description: "Share your knowledge and stories publicly",
  },
  {
    key: "journal",
    label: "Journal Entry",
    icon: BookOpen,
    description: "Private reflections and personal notes",
  },
];

export default function CreateEntryModal({ onClose }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [entryType, setEntryType] = useState("blog");

  const handleContinue = () => {
    navigate("/create-blog", { state: { title, entryType } });
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="bg-[#111511] border border-white/10 rounded-2xl p-8 w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>

        <h2 className="text-xl font-semibold mb-1">Create New Entry</h2>
        <p className="text-gray-400 text-sm mb-6">What would you like to write today?</p>

        <label className="block mb-6">
          <span className="text-sm font-medium mb-2 block">Title</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your title..."
            className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm placeholder:text-gray-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
        </label>

        <span className="text-sm font-medium mb-3 block">Entry Type</span>
        <div className="grid grid-cols-2 gap-3 mb-8">
          {entryTypes.map(({ key, label, icon: Icon, description }) => {
            const active = entryType === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setEntryType(key)}
                className={`relative text-left rounded-xl border p-4 transition-colors ${
                  active
                    ? "border-emerald-500/50 bg-emerald-500/10"
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                }`}
              >
                {active && (
                  <span className="absolute top-3 right-3 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-black text-[10px]">
                    ✓
                  </span>
                )}
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${
                    active ? "bg-emerald-500/20" : "bg-white/10"
                  }`}
                >
                  <Icon size={16} className={active ? "text-emerald-400" : "text-gray-400"} />
                </div>
                <p className="font-semibold text-sm mb-1">{label}</p>
                <p className="text-xs text-gray-400 leading-snug">{description}</p>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors rounded-full text-sm font-medium py-2.5"
          >
            Cancel
          </button>
          <button
            onClick={handleContinue}
            disabled={!title.trim()}
            className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-black rounded-full text-sm font-medium py-2.5"
          >
            Continue <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}