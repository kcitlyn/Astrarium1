import type { FC } from "react";
import {
  Stars,
  Flower2,
  CalendarClock,
  NotebookPen,
  Heart,
  Shield,
  CheckCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

type FeatureCardProps = {
  icon: any;
  title: string;
  description: string;
  features: string[];
};

const FeatureCard: FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  features,
}) => {
  return (
    <Card>
      <CardHeader>
        <Icon className="mb-2 h-8 w-8 text-sky-400" />
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm text-muted-foreground">
          {features.map((feature) => (
            <li key={feature} className="flex items-center">
              <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export type FeaturesSectionProps = {};

export const FeaturesSection: FC<FeaturesSectionProps> = () => {
  const features = [
    {
      key: "task-to-light",
      icon: Stars,
      title: "Task to Light",
      description:
        "Turn finished tasks into starlight that feeds your companion.",
      features: [
        "Small, medium, large task sizes",
        "Earn light on completion",
        "See brightness rise",
      ],
    },
    {
      key: "evolution",
      icon: Flower2,
      title: "Evolution Stages",
      description: "Grow from Sprout to Bloom to Constellation.",
      features: [
        "Stage unlocks by light total",
        "Visual changes over time",
        "Naming and simple care",
      ],
    },
    {
      key: "rhythm",
      icon: CalendarClock,
      title: "Gentle Rhythm",
      description: "Build a calm streak without pressure.",
      features: ["Daily check-ins", "Missed days dim slowly", "Fast recovery"],
    },
    {
      key: "reflections",
      icon: NotebookPen,
      title: "Reflections",
      description: "Short prompts that help you plan the next step.",
      features: [
        "Quick end-of-day note",
        "Tag patterns",
        "Nudges for tomorrow",
      ],
    },
    {
      key: "pet-care",
      icon: Heart,
      title: "Pet Care",
      description: "Visit, feed, and customize your celestial companion.",
      features: ["Name your pet", "Simple feeding ritual", "Cosmetic unlocks"],
    },
    {
      key: "protected",
      icon: Shield,
      title: "Protected Garden",
      description: "Sign in to keep progress safe across devices.",
      features: ["Account storage", "Basic privacy", "Easy sign out"],
    },
  ];

  return (
    <section id="features" className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold">Feature highlights</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Stay consistent, care for your world, and watch your companion
            evolve
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map(({ key, ...feature }) => (
            <FeatureCard key={key} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};
