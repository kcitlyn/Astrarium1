import type { FC } from "react";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";

import { Github, Zap } from "lucide-react";

import Link from "next/link";
import { APP_CONFIG } from "@/config/app";

import { Star } from "lucide-react";

export type HeroSectionProps = {};

export const HeroSection: FC<HeroSectionProps> = () => {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4 text-center">
        <Badge variant="secondary" className="mb-4">
          <Star className="h-4 w-4 mr-1 text-blue-400 drop-shadow-[0_0_6px_rgba(74,222,128,0.8)]" />
          Ready to Glow
        </Badge>
        <h1
          className="text-4xl md:text-6xl font-bold tracking-tight mb-6 [font-family:var(--font-brand)]
    text-3xl md:text-4xl font-extrabold tracking-wide
    bg-gradient-to-tr from-indigo-500 via-sky-400 to-fuchsia-700
    text-transparent bg-clip-text
    drop-shadow-[0_0_18px_rgba(99,102,241,0.35)]"
        >
          Astrarium
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Your productivity fuels the stars! Grow a living constellation by
          completing tasks and caring for your celestial pet.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="text-lg px-8  text-lg px-8
    bg-gradient-to-tr from-indigo-500 via-sky-400 to-fuchsia-700
    text-slate-900
    shadow-lg shadow-indigo-500/20
    hover:from-indigo-300 hover:via-sky-200 hover:to-fuchsia-200
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
    focus-visible:ring-indigo-300"
          >
            <Link href="/simple-signup">Get Started</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
