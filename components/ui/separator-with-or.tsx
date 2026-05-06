import * as React from "react";

interface SeparatorWithOrProps {
  children?: React.ReactNode;
  className?: string;
}

export default function SeparatorWithOr({ 
  children = "or", 
  className = "" 
}: SeparatorWithOrProps) {
  return (
    <div className={`relative flex items-center py-2 ${className}`}>
      <div className="grow border-t border-gray-300" />
      <span className="mx-4 shrink text-sm text-gray-500">{children}</span>
      <div className="grow border-t border-gray-300" />
    </div>
  );
}
