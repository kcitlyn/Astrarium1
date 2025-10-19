import type { FC } from "react";


import Image from "next/image";
import Link from "next/link";


import { Button } from "@workspace/ui/components/button";


import { ModeToggle } from "@/components/mode-toggle";


export type LandingHeaderProps = {
 isAuth: boolean;
};


export const LandingHeader: FC<LandingHeaderProps> = (props) => {
 const { isAuth } = props;


 return (
   <header className="border-b">
     <div className="container mx-auto px-4 py-4 flex items-center justify-between">
       <div className="flex items-center space-x-2">
         <Image
           src="/apple-icon.png"
           alt="logo"
           width={32}
           height={32}
           className="h-8 w-8"
           priority
         />
         <span
           className="font-bold text-xl  [font-family:var(--font-brand)]
   text-xl md:text-xl font-extrabold tracking-wide
   bg-gradient-to-tr from-indigo-500 via-sky-400 to-fuchsia-700
   text-transparent bg-clip-text
   drop-shadow-[0_0_18px_rgba(99,102,241,0.35)]"
         >
           Astrarium
         </span>
       </div>
       <div className="flex items-center space-x-2">
         <ModeToggle />
         <nav className="hidden md:flex items-center space-x-6 ml-4">
           <Link
             href="#features"
             className="text-sm hover:text-primary transition-colors"
           >
             Features
           </Link>
           <Link
             href="#demo"
             className="text-sm hover:text-primary transition-colors"
           >
             Demo
           </Link>
           <Link
             href="#about"
             className="text-sm hover:text-primary transition-colors"
           >
             About Us
            </Link>
           <Link
             href="#cta"
             className="text-sm hover:text-primary transition-colors"
           >




           </Link>
           {isAuth ? (
             <Button variant="outline" size="sm">
               <Link href="/private">Dashboard</Link>
             </Button>
           ) : (
             // temporarily hide "Get Started"
             null
             /*
             <Button
               size="sm"
               className="
                 text-lg px-8
                 bg-gradient-to-tr from-indigo-500 via-sky-400 to-fuchsia-600
                 text-slate-900
                 shadow-lg shadow-indigo-500/20
                 hover:from-indigo-300 hover:via-sky-200 hover:to-fuchsia-200
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                 focus-visible:ring-indigo-300
               "
             >
               <Link href="/login">Get Started</Link>
             </Button>
             */
           )}
         </nav>
       </div>
     </div>
   </header>
 );
};
