import type { FC } from "react";
import type { LucideIcon } from "lucide-react";


import {
 Star,          // Welcome
 CheckCircle2,  // Turn Tasks into Light
 Baby,          // Evolution
 Sparkles,      // Reflect and Recenter
 Palette,       // Explore and Personalize
 Rocket,        // The Takeaway
} from "lucide-react";


type FeatureItemProps = {
 icon: LucideIcon;
 title: string;
 description: string;
};


const FeatureItem: FC<FeatureItemProps> = ({ icon: Icon, title, description }) => {
 return (
   <div className="flex items-start space-x-3">
     <Icon className="h-5 w-5 text-primary mt-0.5" />
     <div>
       <h4 className="font-semibold">{title}</h4>
       <p className="text-sm text-muted-foreground">{description}</p>
     </div>
   </div>
 );
};


export type DevExperienceSectionProps = {};


export const DevExperienceSection: FC<DevExperienceSectionProps> = () => {
 const features = [
   {
     key: "welcome",
     icon: Star,
     title: "Welcome to Your Constellation",
     description:
       "Start on the landing page where your celestial pet awaits. The interface adapts to your theme and greets you with gentle animations and a glow that mirrors your progress.",
   },
   {
     key: "task-to-light",
     icon: CheckCircle2,
     title: "Turn Tasks into Light",
     description:
       "Add a task, small, medium, or large. When you complete it, your effort becomes starlight that fuels your pet. Each success brightens your world and builds a steady, forgiving streak.",
   },
   {
     key: "evolution",
     icon: Baby,
     title: "Watch Evolution in Action",
     description:
       "Your pet evolves from Sprout to Bloom to Constellation as your light accumulates. You can visit, name, and care for it. Missed days dim the glow slightly, then you recover fast.",
   },
   {
     key: "reflect",
     icon: Sparkles,
     title: "Reflect and Recenter",
     description:
       "End each day with a quick reflection. Track patterns and celebrate progress. No pressure, just awareness and a calm rhythm that fits real life.",
   },
   {
     key: "personalize",
     icon: Palette,
     title: "Explore and Personalize",
     description:
       "Switch themes, feed your pet, and explore your Protected Garden. Your progress, reflections, and customizations are saved securely to your account.",
   },
   {
     key: "takeaway",
     icon: Rocket,
     title: "The Takeaway",
     description:
       "Astrarium makes productivity feel personal. Each click, task, and reflection fuels your companion and your momentum, turning consistency into something cosmic.",
   },
 ];


 return (
   <section id="demo" className="py-20 bg-muted/50">
     <div className="container mx-auto px-4">
       <div className="text-center mb-16">
         <h2 className="text-3xl font-bold mb-4">Demo Walkthrough</h2>
         <p className="text-muted-foreground">
           See how your effort becomes light and your companion grows
         </p>
       </div>


       <div className="grid md:grid-cols-2 gap-12 items-center">
         {/* Left: feature list */}
         <div>
           <h3 className="text-2xl font-bold mb-6">Demo Flow</h3>
           <div className="space-y-4">
             {features.map(({ key, ...feature }) => (
               <FeatureItem key={key} {...feature} />
             ))}
           </div>
         </div>


         {/* Right: concise steps card */}
         {/* Right: embedded video */}
<div className="rounded-lg overflow-hidden border dark:border-slate-800 bg-black">
 <div className="relative w-full pt-[56.25%]">
   {/* 16:9 aspect ratio */}
   <iframe
     className="absolute inset-0 h-full w-full"
     src="https://www.youtube.com/embed/VIDEO_ID?rel=0&modestbranding=1"
     title="Astrarium Demo"
     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
     allowFullScreen
     referrerPolicy="strict-origin-when-cross-origin"
   />
 </div>
</div>
       </div>
     </div>
   </section>
 );
};


