import { Heart, Stars, Leaf } from "lucide-react";

export function AboutSection() {
  return (
    //if want to make this section gray add bg-muted/50 after the py-20
    <section id="about" className="py-20">
      <div className="container mx-auto px-4 ">
        <div className="mx-auto max-w-3xl text-center ">
          <h2 className="text-3xl font-bold">About Astrarium</h2>
          <p className="mt-4 text-muted-foreground">
            We believe progress feels better when it feels like care. Astrarium
            turns your tasks into light for a small celestial companion. You
            build consistency, the world grows brighter.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-3 ">
          <div className="rounded-xl border p-6 ">
            <Stars className="h-6 w-6 text-sky-400" />
            <h3 className="mt-3 text-lg font-semibold">Our mission</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Make focus gentle. Replace pressure with small wins that add up.
            </p>
          </div>

          <div className="rounded-xl border p-6">
            <Leaf className="h-6 w-6 text-sky-400" />
            <h3 className="mt-3 text-lg font-semibold">What we build</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              A task garden where effort feeds growth. Evolve a companion as you
              move through your day.
            </p>
          </div>

          <div className="rounded-xl border p-6">
            <Heart className="h-6 w-6 text-sky-400" />
            <h3 className="mt-3 text-lg font-semibold">Why it matters</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Motivation lasts when it feels kind. Astrarium helps you return,
              not burn out.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
