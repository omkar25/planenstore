"use client";

import { cn } from "@/lib/utils";

interface AuroraTextProps {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
}

export function AuroraText({
  children,
  className,
  as: Tag = "span",
}: AuroraTextProps) {
  return (
    <Tag
      className={cn(
        "aurora-text relative inline-block bg-clip-text text-transparent",
        className
      )}
    >
      {children}
    </Tag>
  );
}
