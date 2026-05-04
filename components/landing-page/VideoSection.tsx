"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const VIDEO_LEFT = "https://toriplanen.de/images/video/video_1.mp4";
const VIDEO_RIGHT = "https://toriplanen.de/images/video/video_2.mp4";
const VIDEO_CENTER = "https://toriplanen.de/images/video/video_3.mp4";

export default function VideoSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -100px 0px" });

  return (
    <section className="py-10 bg-background">
      <div className="max-w-[1800px] mx-auto px-1">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6"
        >
          {/* Left Video */}
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-muted border border-border shadow-lg">
            
             <video
              src={VIDEO_CENTER}
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

          {/* Center Video */}
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
