"use client";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import {
  ThemeProvider,
} from "next-themes";

import {
  useState,
  type ReactNode,
} from "react";

import {
  AuthProvider,
} from "@/contexts/AuthContext";

interface AppProvidersProps {
  readonly children: ReactNode;
}

export function AppProviders({
  children,
}: AppProvidersProps): React.JSX.Element {
  const [
   queryClient,
  ]=
   useState(
    () =>
      new QueryClient({
       defaultOptions: {
         queries: {
          staleTime:
            60 * 1000,

         gcTime:
          10 * 60 * 1000,

         retry:
          2,

           refetchOnWindowFocus:
            false,

           refetchOnReconnect:
            true,
         },

           mutations: {
             retry:
              0,
           },
         },
       })
  );

 return (
   <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange
   >
    <QueryClientProvider
     client={queryClient}
    >
     <AuthProvider>
       {children}
     </AuthProvider>
    </QueryClientProvider>
   </ThemeProvider>
 );
}
