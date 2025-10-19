import type { FC } from "react";


import { Button } from "@workspace/ui/components/button";
import { FileText, Github } from "lucide-react";
import Link from "next/link";


import { APP_CONFIG } from "@/config/app";


export type CtaSectionProps = {};


export const CtaSection: FC<CtaSectionProps> = () => {
 return (
   <section className="py-20">
     <div className="container mx-auto px-4 text-center">
       <h2 className="text-3xl font-bold mb-4">

       </h2>
       <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">

       </p>
       <div className="flex flex-col sm:flex-row gap-4 justify-center">
         {/* <Button size="lg" className="text-lg px-8">
           <Link href="/login">Get Started Now</Link>
         </Button> */}     
       </div>
     </div>
   </section>
 );
};
