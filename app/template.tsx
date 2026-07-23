"use client";

import {
  motion,
  useReducedMotion,
} from "framer-motion";

import type {
  ReactNode,
} from "react";

import {
  AppProviders,
} from "@/components/providers/AppProviders";

import {
  ANIMATIONS,
} from "@/constants/animations";

interface RootTemplateProps {
  readonly children: ReactNode;
}

export default function RootTemplate({
  children,
}: RootTemplateProps): React.JSX.Element {
  const prefersReducedMotion =
   useReducedMotion();

 return (
  <AppProviders>
    <motion.div
     initial={
       prefersReducedMotion
        ?{
            opacity: 1,
          }
        :{
            opacity: 0,
            y: 8,
          }
     }
     animate={{
       opacity: 1,
       y: 0,
     }}
     transition={{
       duration:
        prefersReducedMotion
          ?0

         : ANIMATIONS.PAGE.ENTER /
           1000,

       ease:
        ANIMATIONS.EASING.STANDARD,
     }}
     className="min-h-screen"
    >
     {children}
    </motion.div>
   </AppProviders>
 );
}
