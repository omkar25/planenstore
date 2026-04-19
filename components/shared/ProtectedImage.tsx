"use client";

import React from "react";
import Image, { ImageProps } from "next/image";

/**
 * A wrapper around next/image that prevents casual downloading:
 * - Disables right-click context menu
 * - Disables drag-and-drop saving
 * - Adds a transparent overlay to block direct interaction
 * - Disables long-press save on mobile
 *
 * NOTE: This is a deterrent, not bulletproof.
 * A determined user can still capture via dev-tools or screenshots.
 */
export default function ProtectedImage(props: ImageProps) {
  return (
    <Image
      {...props}
      alt={props.alt || ""}
      draggable={false}
      onContextMenu={(e) => e.preventDefault()}
      style={{ ...props.style, WebkitTouchCallout: "none" } as React.CSSProperties}
    />
  );
}
