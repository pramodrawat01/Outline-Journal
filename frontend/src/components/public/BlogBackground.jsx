
import { useState, useEffect } from "react";

const SQUARES = [
  { row: 0, col: 2, opacity: 0.04 },
  { row: 0, col: 8, opacity: 0.1 },
  { row: 8, col: 25, opacity: 0.1 },
  { row: 1, col: 13, opacity: 0.1 },
  { row: 2, col: 21, opacity: 0.05 },
  { row: 12, col: 17, opacity: 0.1 },
//   { row: 4, col: 6, opacity: 0.08 },
  { row: 5, col: 14, opacity: 0.06 },
  { row: 6, col: 9, opacity: 0.12 },
  { row: 8, col: 4, opacity: 0.1 },
  { row: 11, col: 7, opacity: 0.12 },
];

export default function BlogBackground() {
  const [gridSize, setGridSize] = useState(
    () => (window.innerWidth < 640 ? 36 : 56)
  );

  useEffect(() => {
    const handleResize = () => {
      setGridSize(window.innerWidth < 640 ? 36 : 56);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {/* Responsive grid lines */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)
          `,
          backgroundSize: `${gridSize}px ${gridSize}px`,
        }}
      />

      {/* Random highlighted grid squares */}
      {SQUARES.map((square, index) => (
        <div
          key={index}
          className="absolute bg-white"
          style={{
            top: square.row * gridSize,
            left: square.col * gridSize,
            width: gridSize,
            height: gridSize,
            opacity: square.opacity,
          }}
        />
      ))}

      {/* Black gradient from top to bottom */}
        <div
        className="absolute inset-0"
        style={{
            background:
            "linear-gradient(to bottom, #0a0a0a 0%, rgba(10,10,10,0.65) 15%, rgba(10,10,10,0.2) 25%, transparent 100%)",
        }}
        />

        {/* Top-left radial glow */}
        {/* <div
        className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full"
        style={{
            background:
            "radial-gradient(circle, rgba(34,197,94,0.16) 0%, rgba(34,197,94,0.06) 45%, transparent 72%)",
            filter: "blur(60px)",
        }}
        /> */}

        

      {/* Green radial glow — like the landing page */}
      <div
        className="absolute left-1/2 top-[100px] sm:top-[220px] h-[600px] w-[500px] sm:w-[700px] -translate-x-1/2 rounded-full sm:h-[750px] sm:w-[1100px] lg:h-[900px] lg:w-[1500px]"
        style={{
          background:
            "radial-gradient(closest-side, rgba(34,197,94,0.45), rgba(34,197,94,0.15) 50%, transparent 75%)",
          filter: "blur(50px)",
        }}
      />

      {/* Bottom 30% fade into the page background */}
      <div
        className="absolute inset-x-0 bottom-0 h-[30%]"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(10,10,10,0.35) 30%, rgba(10,10,10,0.8) 70%, #0a0a0a 100%)",
        }}
      />
    </div>
  );
}