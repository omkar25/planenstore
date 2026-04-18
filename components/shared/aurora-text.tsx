import { cn } from "@/lib/utils";

interface AuroraTextProps {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  gradient?: string;
}

export function AuroraText({
  children,
  className,
  as: Tag = "span",
  gradient,
}: AuroraTextProps) {
  return (
    <Tag
      className={cn(
        "aurora-text relative inline-block bg-clip-text text-transparent",
        className
      )}
      style={gradient ? { backgroundImage: gradient } : undefined}
    >
      {children}
    </Tag>
  );
}