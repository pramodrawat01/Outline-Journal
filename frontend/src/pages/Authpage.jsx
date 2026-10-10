// import React, { useState } from "react";
// import {
//   FaGithub,
//   FaArrowRight,
//   FaEye,
//   FaEyeSlash,
// } from "react-icons/fa";
// import { Link } from "react-router-dom";
// /* ---------------------------------------------------------- */
// /* Shared bits                                                 */
// /* ---------------------------------------------------------- */

// function Field({ label, ...props }) {
//   return (
//     <label className="block text-left">
//       <span className="text-xs text-gray-400 mb-1.5 block">{label}</span>
//       <input
//         {...props}
//         className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
//       />
//     </label>
//   );
// }

// function PasswordField({ label = "Password", ...props }) {
//   const [show, setShow] = useState(false);
//   return (
//     <label className="block text-left">
//       <span className="text-xs text-gray-400 mb-1.5 block">{label}</span>
//       <div className="relative">
//         <input
//           {...props}
//           type={show ? "text" : "password"}
//           className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 pr-10 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
//         />
//         <button
//           type="button"
//           onClick={() => setShow((s) => !s)}
//           className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
//           tabIndex={-1}
//         >
//           {show ? <FaEyeSlash  size={16} /> : <FaEye  size={16} />}
//         </button>
//       </div>
//     </label>
//   );
// }

// function GithubButton({ label }) {
//   return (
//     <button
//       type="button"
//       className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-sm font-medium rounded-full py-2.5"
//     >
//       <FaGithub size={16} />
//       {label}
//     </button>
//   );
// }

// function Divider() {
//   return (
//     <div className="flex items-center gap-3 my-1">
//       <div className="h-px flex-1 bg-white/10" />
//       <span className="text-[11px] text-gray-500 uppercase tracking-wider">
//         or
//       </span>
//       <div className="h-px flex-1 bg-white/10" />
//     </div>
//   );
// }

// /* ---------------------------------------------------------- */
// /* Form contents                                               */
// /* ---------------------------------------------------------- */

// function LoginFields() {
//   return (
//     <form onSubmit={(e) => e.preventDefault()} className="w-full max-w-sm space-y-4">
//       <div className="text-center mb-2">
//         <h2 className="text-2xl font-semibold mb-1">Welcome back</h2>
//         <p className="text-gray-400 text-sm">Log in to keep writing your entries.</p>
//       </div>

//       <GithubButton label="Continue with GitHub" />
//       <Divider />

//       <Field label="Work email" type="email" placeholder="you@company.com" />
//       <PasswordField placeholder="••••••••" />

//       <div className="flex items-center justify-between text-xs">
//         <label className="flex items-center gap-2 text-gray-400">
//           <input type="checkbox" className="accent-emerald-500 w-3.5 h-3.5" />
//           Remember me
//         </label>
//         <a href="#" className="text-emerald-400 hover:text-emerald-300">
//           Forgot password?
//         </a>
//       </div>

//       <button className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 transition-colors text-black text-sm font-medium rounded-full py-2.5">
//         Log in <FaArrowRight size={15} />
//       </button>
//     </form>
//   );
// }

// function SignupFields() {
//   return (
//     <form onSubmit={(e) => e.preventDefault()} className="w-full max-w-sm space-y-4">
//       <div className="text-center mb-2">
//         <h2 className="text-2xl font-semibold mb-1">Create your account</h2>
//         <p className="text-gray-400 text-sm">
//           Join engineers documenting their journey.
//         </p>
//       </div>

//       <GithubButton label="Sign up with GitHub" />
//       <Divider />

//       <div className="grid grid-cols-2 gap-3">
//         <Field label="Full name" type="text" placeholder="Ada Lovelace" />
//         <Field label="Username" type="text" placeholder="ada" />
//       </div>
//       <Field label="Work email" type="email" placeholder="you@company.com" />
//       <PasswordField placeholder="At least 8 characters" />

//       <label className="flex items-start gap-2 text-xs text-gray-400">
//         <input type="checkbox" className="accent-emerald-500 w-3.5 h-3.5 mt-0.5" />
//         I agree to the Terms of Service and Privacy Policy
//       </label>

//       <button className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 transition-colors text-black text-sm font-medium rounded-full py-2.5">
//         Create account <FaArrowRight size={15} />
//       </button>
//     </form>
//   );
// }

// /* ---------------------------------------------------------- */
// /* Overlay copy (desktop sliding panel)                        */
// /* ---------------------------------------------------------- */

// function OverlayContent({ isSignUp, onSwitch }) {
//   return (
//     <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-10">
//       <span className="text-3xl mb-4">✦</span>
//       {isSignUp ? (
//         <>
//           <h3 className="text-2xl font-semibold mb-3">
//             Already documenting on Outline?
//           </h3>
//           <p className="text-white/80 text-sm mb-8 leading-relaxed max-w-xs">
//             Log back in to pick up your journal where you left off — your
//             drafts and entries are waiting.
//           </p>
//           <button
//             onClick={() => onSwitch(false)}
//             className="border border-white/40 hover:bg-white/10 transition-colors text-sm font-medium rounded-full px-6 py-2.5"
//           >
//             Log in instead
//           </button>
//         </>
//       ) : (
//         <>
//           <h3 className="text-2xl font-semibold mb-3">
//             Building something worth writing about?
//           </h3>
//           <p className="text-white/80 text-sm mb-8 leading-relaxed max-w-xs">
//             Outline is built for software professionals — document your
//             projects, career moves, and everything you're learning.
//           </p>
//           <button
//             onClick={() => onSwitch(true)}
//             //className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 transition-colors text-black text-sm font-medium rounded-full py-2.5"
//             className="border border-white/40 bg-white/10 hover:bg-white/2 transition-colors text-sm font-medium rounded-full px-6 py-2.5"
//           >
//             Create an account
//           </button>
//         </>
//       )}
//     </div>
//   );
// }

// /* ---------------------------------------------------------- */
// /* Main AuthPage                                                */
// /* ---------------------------------------------------------- */

// export default function AuthPage() {
//   const [isSignUp, setIsSignUp] = useState(false);

//   return (
//     <div className="relative min-h-screen w-full bg-[#0a0d0b] text-white font-sans antialiased overflow-hidden flex items-center justify-center px-4 py-10">
//       {/* grid background */}
//       <div
//         className="absolute inset-0 pointer-events-none"
//         style={{
//           backgroundImage:
//             "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
//           backgroundSize: "56px 56px",
//         }}
//       />
//       {/* green radial glow */}
//       <div
//         className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[800px] rounded-full pointer-events-none"
//         style={{
//           background:
//             "radial-gradient(closest-side, rgba(34,197,94,0.35), rgba(34,197,94,0.1) 50%, transparent 75%)",
//           filter: "blur(50px)",
//         }}
//       />

//       {/* brand, top-left */}
//       <Link
//         to='/'
//         className="absolute top-6 left-6 md:top-8 md:left-8 z-20 flex items-center gap-2"
//       >
//         <span className="text-emerald-400 text-xl">✦</span>
//         <span className="font-semibold text-lg tracking-tight">Outline</span>
//       </Link>

//       {/* ============== DESKTOP: sliding split card ============== */}
//       <div className="hidden md:block relative z-10 w-full max-w-4xl h-[600px] rounded-2xl overflow-hidden border border-white/10 bg-[#0d110d] shadow-2xl">
//         {/* Login form — lives on the left half */}
//         <div
//           className={`absolute top-0 left-0 w-1/2 h-full flex items-center justify-center px-10 transition-all duration-700 ease-in-out ${
//             isSignUp
//               ? "translate-x-full opacity-0 z-10 pointer-events-none"
//               : "translate-x-0 opacity-100 z-20"
//           }`}
//         >
//           <LoginFields />
//         </div>

//         {/* Signup form — lives on the right half */}
//         <div
//           className={`absolute top-0 left-0 w-1/2 h-full flex items-center justify-center px-10 transition-all duration-700 ease-in-out translate-x-full ${
//             isSignUp
//               ? "opacity-100 z-20"
//               : "opacity-0 z-10 pointer-events-none"
//           }`}
//         >
//           <SignupFields />
//         </div>

//         {/* Sliding green overlay panel */}
//         <div
//           className={`absolute top-0 w-1/2 h-full z-30 transition-transform duration-700 ease-in-out overflow-hidden ${
//             isSignUp ? "translate-x-0" : "translate-x-full"
//           }`}
//           style={{
//             background:
//               "linear-gradient(160deg, #16a34a 0%, #15803d 55%, #0f3d24 100%)",
//           }}
//         >
//           <div
//             className="absolute inset-0 opacity-20 pointer-events-none"
//             style={{
//               backgroundImage:
//                 "linear-gradient(to right, rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.3) 1px, transparent 1px)",
//               backgroundSize: "40px 40px",
//               maskImage:
//                 "radial-gradient(circle at center, black, transparent 75%)",
//               WebkitMaskImage:
//                 "radial-gradient(circle at center, black, transparent 75%)",
//             }}
//           />
//           <OverlayContent isSignUp={isSignUp} onSwitch={setIsSignUp} />
//         </div>
//       </div>

//       {/* ============== MOBILE: tabbed sliding track ============== */}
//       <div className="md:hidden relative z-10 w-full max-w-sm">
//         <div className="flex bg-white/5 border border-white/10 rounded-full p-1 mb-8">
//           <button
//             onClick={() => setIsSignUp(false)}
//             className={`flex-1 text-sm font-medium rounded-full py-2 transition-colors ${
//               !isSignUp ? "bg-emerald-500 text-black" : "text-gray-400"
//             }`}
//           >
//             Log in
//           </button>
//           <button
//             onClick={() => setIsSignUp(true)}
//             className={`flex-1 text-sm font-medium rounded-full py-2 transition-colors ${
//               isSignUp ? "bg-emerald-500 text-black" : "text-gray-400"
//             }`}
//           >
//             Sign up
//           </button>
//         </div>

//         <div className="overflow-hidden">
//           <div
//             className="flex transition-transform duration-500 ease-in-out"
//             style={{
//               width: "200%",
//               transform: isSignUp ? "translateX(-50%)" : "translateX(0%)",
//             }}
//           >
//             <div className="w-1/2 flex justify-center px-1">
//               <LoginFields />
//             </div>
//             <div className="w-1/2 flex justify-center px-1">
//               <SignupFields />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }









import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaGithub,
  FaArrowRight,
  FaEye,
  FaEyeSlash,
  FaSpinner,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

function Field({ label, ...props }) {
  return (
    <label className="block text-left">
      <span className="text-xs text-gray-400 mb-1.5 block">{label}</span>
      <input
        {...props}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
      />
    </label>
  );
}

function PasswordField({ label = "Password", ...props }) {
  const [show, setShow] = useState(false);
  return (
    <label className="block text-left">
      <span className="text-xs text-gray-400 mb-1.5 block">{label}</span>
      <div className="relative">
        <input
          {...props}
          type={show ? "text" : "password"}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 pr-10 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
          tabIndex={-1}
        >
          {show ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
        </button>
      </div>
    </label>
  );
}

function GithubButton({ label }) {
  return (
    <button
      type="button"
      className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-sm font-medium rounded-full py-2.5"
    >
      <FaGithub size={16} />
      {label}
    </button>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-3 my-1">
      <div className="h-px flex-1 bg-white/10" />
      <span className="text-[11px] text-gray-500 uppercase tracking-wider">or</span>
      <div className="h-px flex-1 bg-white/10" />
    </div>
  );
}

function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
      {message}
    </p>
  );
}

function LoginFields() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form);
      navigate("/profile"); // go profile after login
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
      <div className="text-center mb-2">
        <h2 className="text-2xl font-semibold mb-1">Welcome back  Pramod#123@123</h2>
        <p className="text-gray-400 text-sm">Log in to keep writing your entries.</p>
      </div>

      <GithubButton label="Continue with GitHub" />
      <Divider />

      <ErrorBanner message={error} />

      <Field label="Work email" type="email" name="email" placeholder="you@company.com" value={form.email} onChange={handleChange} required />
      <PasswordField name="password" placeholder="••••••••" value={form.password} onChange={handleChange} required />

      <div className="flex items-center justify-between text-xs">
        <label className="flex items-center gap-2 text-gray-400">
          <input type="checkbox" className="accent-emerald-500 w-3.5 h-3.5" />
          Remember me
        </label>
        <a href="#" className="text-emerald-400 hover:text-emerald-300">Forgot password?</a>
      </div>

      <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 transition-colors text-black text-sm font-medium rounded-full py-2.5">
        {loading ? <FaSpinner size={15} className="animate-spin" /> : <>Log in <FaArrowRight size={15} /></>}
      </button>
    </form>
  );
}

function SignupFields() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", username: "", email: "", password: "", agreedToTerms: false });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.agreedToTerms) {
      setError("You must agree to the Terms of Service and Privacy Policy");
      return;
    }
    setLoading(true);
    try {
      await signup(form);
      navigate("/profile"); // go profile after signup
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
      <div className="text-center mb-2">
        <h2 className="text-2xl font-semibold mb-1">Create your account</h2>
        <p className="text-gray-400 text-sm">Join engineers documenting their journey.</p>
      </div>

      <GithubButton label="Sign up with GitHub" />
      <Divider />

      <ErrorBanner message={error} />

      <div className="grid grid-cols-2 gap-3">
        <Field label="Full name" type="text" name="fullName" placeholder="Ada Lovelace" value={form.fullName} onChange={handleChange} required />
        <Field label="Username" type="text" name="username" placeholder="ada" value={form.username} onChange={handleChange} required />
      </div>
      <Field label="Work email" type="email" name="email" placeholder="you@company.com" value={form.email} onChange={handleChange} required />
      <PasswordField name="password" placeholder="At least 8 characters" value={form.password} onChange={handleChange} required minLength={8} />

      <label className="flex items-start gap-2 text-xs text-gray-400">
        <input type="checkbox" name="agreedToTerms" checked={form.agreedToTerms} onChange={handleChange} className="accent-emerald-500 w-3.5 h-3.5 mt-0.5" />
        I agree to the Terms of Service and Privacy Policy
      </label>

      <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 transition-colors text-black text-sm font-medium rounded-full py-2.5">
        {loading ? <FaSpinner size={15} className="animate-spin" /> : <>Create account <FaArrowRight size={15} /></>}
      </button>
    </form>
  );
}

function OverlayContent({ isSignUp, onSwitch }) {
  return (
    <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-10">
      <span className="text-3xl mb-4">✦</span>
      {isSignUp ? (
        <>
          <h3 className="text-2xl font-semibold mb-3">Already documenting on Outline?</h3>
          <p className="text-white/80 text-sm mb-8 leading-relaxed max-w-xs">
            Log back in to pick up your journal where you left off.
          </p>
          <button onClick={() => onSwitch(false)} className="border border-white/40 hover:bg-white/10 transition-colors text-sm font-medium rounded-full px-6 py-2.5">
            Log in instead
          </button>
        </>
      ) : (
        <>
          <h3 className="text-2xl font-semibold mb-3">Building something worth writing about?</h3>
          <p className="text-white/80 text-sm mb-8 leading-relaxed max-w-xs">
            Outline is built for software professionals to document their journeys.
          </p>
          <button onClick={() => onSwitch(true)} className="border border-white/40 hover:bg-white/10 transition-colors text-sm font-medium rounded-full px-6 py-2.5">
            Create an account
          </button>
        </>
      )}
    </div>
  );
}

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="relative min-h-screen w-full bg-[#0a0d0b] text-white font-sans antialiased overflow-hidden flex items-center justify-center px-4 py-10">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[800px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(closest-side, rgba(34,197,94,0.35), rgba(34,197,94,0.1) 50%, transparent 75%)",
          filter: "blur(50px)",
        }}
      />

      <a href="/" className="absolute left-6 top-8 md:left-8 z-20 flex items-center gap-2">
        <span className="text-emerald-400 text-xl">✦</span>
        <span className="font-semibold text-lg tracking-tight">Outline</span>
      </a>

      {/* DESKTOP */}
      <div className="hidden md:block relative z-10 w-full max-w-4xl h-[600px] rounded-2xl overflow-hidden border border-white/10 bg-[#0d110d] shadow-2xl">
        <div className={`absolute top-0 left-0 w-1/2 h-full flex items-center justify-center px-10 transition-all duration-700 ease-in-out ${isSignUp ? "translate-x-full opacity-0 z-10 pointer-events-none" : "translate-x-0 opacity-100 z-20"}`}>
          <LoginFields />
        </div>
        <div className={`absolute top-0 left-0 w-1/2 h-full flex items-center justify-center px-10 transition-all duration-700 ease-in-out translate-x-full ${isSignUp ? "opacity-100 z-20" : "opacity-0 z-10 pointer-events-none"}`}>
          <SignupFields />
        </div>
        <div
          className={`absolute top-0 w-1/2 h-full z-30 transition-transform duration-700 ease-in-out overflow-hidden ${isSignUp ? "translate-x-0" : "translate-x-full"}`}
          style={{ background: "linear-gradient(160deg, #16a34a 0%, #15803d 55%, #0f3d24 100%)" }}
        >
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.3) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
              maskImage: "radial-gradient(circle at center, black, transparent 75%)",
              WebkitMaskImage: "radial-gradient(circle at center, black, transparent 75%)",
            }}
          />
          <OverlayContent isSignUp={isSignUp} onSwitch={setIsSignUp} />
        </div>
      </div>

      {/* MOBILE */}
      <div className="md:hidden relative z-10 w-full max-w-sm p-4 bg-[#0d110d] rounded-2xl">
        <div className="flex bg-white/5 border border-white/10 rounded-full p-1 mb-8">
          <button onClick={() => setIsSignUp(false)} className={`flex-1 text-sm font-medium rounded-full py-2 transition-colors ${!isSignUp ? "bg-emerald-500 text-black" : "text-gray-400"}`}>Log in</button>
          <button onClick={() => setIsSignUp(true)} className={`flex-1 text-sm font-medium rounded-full py-2 transition-colors ${isSignUp ? "bg-emerald-500 text-black" : "text-gray-400"}`}>Sign up</button>
        </div>
        <div className="overflow-hidden">
          <div className="flex transition-transform duration-500 ease-in-out" style={{ width: "200%", transform: isSignUp ? "translateX(-50%)" : "translateX(0%)" }}>
            <div className="w-1/2 flex justify-center px-1"><LoginFields /></div>
            <div className="w-1/2 flex justify-center px-1"><SignupFields /></div>
          </div>
        </div>
      </div>
    </div>
  );
}

