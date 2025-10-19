"use client";

import type { FC, ComponentType } from "react";
import {
  Stars,
  Flower2,
  Sparkles,
  CheckCircle2,
  CalendarClock,
  NotebookPen,
} from "lucide-react";

// Small card component for a feature
type FeatureCardProps = {
  title: string;
  desc: string;
  Icon: ComponentType<{ className?: string }>;
};

const FeatureCard: FC<FeatureCardProps> = ({ title, desc, Icon }) => (
  <div className="rounded-xl border p-5">
    <Icon className="mb-3 h-5 w-5 text-sky-400" />
    <h3 className="text-lg font-medium">{title}</h3>
    <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
  </div>
);

// Keep the same exported component name so other files keep working
export type TechStackSectionProps = {};

export const TechStackSection: FC<TechStackSectionProps> = () => {
  const features: FeatureCardProps[] = [
    {
      title: "Send Light",
      desc: "Finish a task to earn light. Your companion brightens as you make progress.",
      Icon: Stars,
    },
    {
      title: "Evolve Through Stages",
      desc: "Sprout to Bloom to Constellation. New looks unlock as your light rises.",
      Icon: Flower2,
    },
    {
      title: "Gentle Rhythm",
      desc: "Miss a day, the glow fades a little. No shaming. Start fresh tomorrow.",
      Icon: Sparkles,
    },
    {
      title: "Task to Light",
      desc: "Size a task small, medium, or large. Bigger effort gives more light.",
      Icon: CheckCircle2,
    },
    {
      title: "Daily Streak",
      desc: "Keep a calm streak. Breaks reduce glow a bit, then you recover fast.",
      Icon: CalendarClock,
    },
    {
      title: "Reflections",
      desc: "Short prompts help you notice patterns and plan the next step.",
      Icon: NotebookPen,
    },
  ];

  return (
    <section id="how-it-works" className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold">How Astrarium Works</h2>
          <p className="text-muted-foreground">
            Grow a celestial companion by turning tasks into starlight
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {features.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
};
