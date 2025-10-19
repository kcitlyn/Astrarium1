import type { FC } from "react";

import type { LandingHeaderProps } from "./landing-header";
import { LandingHeader } from "./landing-header";
import { HeroSection } from "./hero-section";
import { FeaturesSection } from "./features-section";
import { DevExperienceSection } from "./dev-experience-section";
import { CtaSection } from "./cta-section";
import { LandingFooter } from "./landing-footer";
import { TechStackSection } from "./tech-stack-section";
import { AboutSection } from "@/modules/landing/about-section";
import { StarryBackground } from "@/components/starry-background";
export type LandingHomeProps = LandingHeaderProps;

export const LandingHome: FC<LandingHomeProps> = (props) => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Celestial Starry Background */}
      <StarryBackground />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <LandingHeader {...props} />

      {/* Hero Section */}
      <HeroSection />

      {/* Tech Stack Section */}
      <TechStackSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Developer Experience Section */}
      <DevExperienceSection />

      <AboutSection />

      {/* CTA Section */}
      <CtaSection />

        {/* Footer */}
        <LandingFooter />
      </div>
    </div>
  );
};
