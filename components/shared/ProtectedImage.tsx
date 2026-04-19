"use client";

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
  const isFill = props.fill === true;

  return (
    <div
      className={isFill ? "absolute inset-0 select-none" : "relative select-none"}
      style={{ WebkitTouchCallout: "none" }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <Image
        {...props}
        alt={props.alt || ""}
        draggable={false}
        onContextMenu={(e) => e.preventDefault()}
      />
      {/* Transparent overlay blocks direct image interaction */}
      <div className="absolute inset-0 z-10" aria-hidden="true" />
    </div>
  );
}
