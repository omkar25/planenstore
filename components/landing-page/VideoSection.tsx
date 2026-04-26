"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const VIDEO_LEFT = "/video/video_1.mp4";
const VIDEO_RIGHT = "/video/video_2.mp4";

export default function VideoSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -100px 0px" });

  return (
    <section className="py-10 bg-background">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
        >
          {/* Left Video */}
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-muted border border-border shadow-lg">
            <video
              src={VIDEO_LEFT}
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            >
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Right Video */}
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-muted border border-border shadow-lg">
            <video
              src={VIDEO_RIGHT}
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
