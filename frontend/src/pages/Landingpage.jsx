
import React from "react";

import Hero from "../components/landingPage/Hero";
import LogoStrip from "../components/landingPage/LogoStrip";
import Features from "../components/landingPage/Features";
import HowItWorks from "../components/landingPage/HowItWorks";
import ExplorePreview from "../components/landingPage/ExplorePreview";
import Testimonials from "../components/landingPage/Testimonials";
import CTA from "../components/landingPage/Cta";
import Footer from "../components/landingPage/Footer";

/**
 * LandingPage — Outline, a journaling platform where people create a
 * profile and document their journey through blog-style entries.
 *
 * Composed from section components under ./components so each part
 * (header, hero, features, etc.) can be edited independently.
 */
export default function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-[#0a0d0b] text-white font-sans antialiased overflow-x-hidden">
      <Hero />
      <LogoStrip />
      <Features />
      <HowItWorks />
      <ExplorePreview />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}