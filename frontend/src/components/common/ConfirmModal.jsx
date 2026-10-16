// export default function ConfirmModal({
//   isOpen,
//   onClose,
//   onConfirm,
//   title = "Are you sure?",
//   description = "This action cannot be undone.",
//   confirmText = "Confirm",
//   cancelText = "Cancel",
//   loading = false,
// }) {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
//       <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#111511] p-6 text-center">
        
//         <h3 className="mb-2 text-lg font-semibold text-white">
//           {title}
//         </h3>

//         <p className="mb-6 text-sm text-gray-400">
//           {description}
//         </p>

//         <div className="flex gap-3">
//           {/* Cancel */}
//           <button
//             type="button"
//             onClick={onClose}
//             disabled={loading}
//             className="
//               flex-1 rounded-full
//               border border-white/10
//               bg-white/5
//               py-2.5
//               text-sm text-white
//               transition
//               hover:bg-white/10
//               disabled:cursor-not-allowed
//               disabled:opacity-50
//             "
//           >
//             {cancelText}
//           </button>

//           {/* Confirm */}
//           <button
//             type="button"
//             onClick={onConfirm}
//             disabled={loading}
//             className="
//               flex-1 rounded-full
//               bg-emerald-500
//               py-2.5
//               text-sm font-medium
//               text-black
//               transition
//               hover:bg-emerald-400
//               disabled:cursor-not-allowed
//               disabled:opacity-50
//             "
//           >
//             {loading ? "Please wait..." : confirmText}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useEffect } from "react";
import { createPortal } from "react-dom";

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  variant = "default", // "default" | "danger"
}) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape" && !loading) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  const confirmColors =
    variant === "danger"
      ? "bg-red-500 text-white hover:bg-red-400"
      : "bg-emerald-500 text-black hover:bg-emerald-400";

  return createPortal(
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
      onClick={loading ? undefined : onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#111511] p-6 text-center"
      >
        <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>

        <p className="mb-6 text-sm text-gray-400">{description}</p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-full border border-white/10 bg-white/5 py-2.5 text-sm text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 rounded-full py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${confirmColors}`}
          >
            {loading ? "Please wait..." : confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}