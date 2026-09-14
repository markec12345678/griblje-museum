"use client";

import * as React from "react";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MotionConfig } from "framer-motion";
import { LanguageProvider } from "@/lib/i18n";
import { A11yProvider, useA11y } from "@/lib/a11y";

/** Mirni gibi iz dostopnostne plošče veljajo tudi za framer-motion. */
function MotionPreferences({ children }: { children: React.ReactNode }) {
  const { settings } = useA11y();
  return (
    <MotionConfig reducedMotion={settings.calmMotion ? "always" : "user"}>
      {children}
    </MotionConfig>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            retry: 2,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <A11yProvider>
          <MotionPreferences>
            <LanguageProvider>{children}</LanguageProvider>
          </MotionPreferences>
        </A11yProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
