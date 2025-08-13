"use client";
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  showRadialGradient?: boolean;
}

export const AuroraBackground = ({
                                   className,
                                   children,
                                   showRadialGradient = true,
                                   ...props
                                 }: AuroraBackgroundProps) => {
  return (
      <main>
        <div
            className={cn(
                "transition-bg relative flex h-[100vh] flex-col items-center justify-center bg-pink-50 text-slate-950 dark:bg-pink-950",
                className,
            )}
            {...props}
        >
          <div
              className="absolute inset-0 overflow-hidden"
              style={
                {
                  "--aurora":
                      "repeating-linear-gradient(100deg,#ec4899_10%,#f472b6_15%,#f9a8d4_20%,#e879f9_25%,#d946ef_30%)",
                  "--dark-gradient":
                      "repeating-linear-gradient(100deg,#000_0%,#000_7%,transparent_10%,transparent_12%,#000_16%)",
                  "--white-gradient":
                      "repeating-linear-gradient(100deg,#fff_0%,#fff_7%,transparent_10%,transparent_12%,#fff_16%)",

                  "--pink-300": "#f9a8d4",
                  "--pink-400": "#f472b6",
                  "--pink-500": "#ec4899",
                  "--fuchsia-300": "#e879f9",
                  "--fuchsia-500": "#d946ef",
                  "--black": "#000",
                  "--white": "#fff",
                  "--transparent": "transparent",
                } as React.CSSProperties
              }
          >
            <div
                className={cn(
                    `after:animate-aurora pointer-events-none absolute -inset-[10px] 
              [background-image:var(--white-gradient),var(--aurora)] 
              [background-size:300%,_200%] 
              [background-position:50%_50%,50%_50%] 
              opacity-50 blur-[10px] invert filter will-change-transform 
              after:absolute after:inset-0 
              after:[background-image:var(--white-gradient),var(--aurora)] 
              after:[background-size:200%,_100%] 
              after:[background-attachment:fixed] 
              after:mix-blend-difference after:content-[""] 
              dark:[background-image:var(--dark-gradient),var(--aurora)] 
              dark:invert-0 after:dark:[background-image:var(--dark-gradient),var(--aurora)]`,

                    showRadialGradient &&
                    `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]`,
                )}
            ></div>
          </div>
          {children}
        </div>
      </main>
  );
};