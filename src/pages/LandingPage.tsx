import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { FeatureCarousel } from '../components/FeatureCarousel';
import { HowItWorks } from '../components/HowItWorks';
import { RoiCalculator } from '../components/RoiCalculator';
import { Pricing } from '../components/Pricing';
import { Testimonials } from '../components/Testimonials';
import { FaqSection } from '../components/FaqSection';
import { BottomCta } from '../components/BottomCta';
import { Footer } from '../components/Footer';
import { TrialModal } from '../components/TrialModal';
import { DemoModal } from '../components/DemoModal';
import { LoginModal } from '../components/LoginModal';
import { PricingPlan } from '../types';

export default function LandingPage() {
  const [trialModalOpen, setTrialModalOpen] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);

  const handleOpenTrial = (plan?: PricingPlan) => {
    setSelectedPlan(plan || null);
    setTrialModalOpen(true);
  };

  const handleOpenDemo = () => {
    setDemoModalOpen(true);
  };

  const handleOpenLogin = () => {
    setLoginModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#FF5722]/30 selection:text-orange-200">
      {/* Top Bar Navigation */}
      <Navbar
        onOpenTrial={() => handleOpenTrial()}
        onOpenLogin={handleOpenLogin}
      />

      {/* Main Page Flow */}
      <main className="flex-1">
        {/* 1. Hero Section */}
        <Hero
          onOpenTrial={() => handleOpenTrial()}
          onOpenDemo={handleOpenDemo}
        />

        {/* 2. Auto-Sliding Feature Carousel (5-second auto-play) */}
        <FeatureCarousel />

        {/* 3. How It Works (3-step pipeline) */}
        <HowItWorks />

        {/* 4. Interactive ROI & Cash Recovery Estimator */}
        <RoiCalculator onOpenTrial={() => handleOpenTrial()} />

        {/* 5. Pricing Table (3 tiers) */}
        <Pricing onSelectPlan={(plan) => handleOpenTrial(plan)} />

        {/* 6. Quantified Social Proof & Testimonials */}
        <Testimonials />

        {/* 7. FAQ Accordion */}
        <FaqSection />

        {/* 8. Bottom CTA Banner */}
        <BottomCta onOpenTrial={() => handleOpenTrial()} />
      </main>

      {/* Quiet Corporate Footer */}
      <Footer onOpenTrial={() => handleOpenTrial()} />

      {/* Modals */}
      <TrialModal
        isOpen={trialModalOpen}
        onClose={() => setTrialModalOpen(false)}
        selectedPlan={selectedPlan}
      />

      <DemoModal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
        onOpenTrial={() => {
          setDemoModalOpen(false);
          setTrialModalOpen(true);
        }}
      />

      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onSwitchToTrial={() => {
          setLoginModalOpen(false);
          setTrialModalOpen(true);
        }}
      />
    </div>
  );
}
