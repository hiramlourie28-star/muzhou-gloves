"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface Props {
  images: string[];
  alt: string;
}

export default function ProductGallery({ images, alt }: Props) {
  const [active, setActive] = useState(0);
  const main = images[active] ?? images[0];

  if (!main) {
    return <div className="relative aspect-[3/4] bg-glacier-200" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-3"
    >
      <div className="relative aspect-[3/4] bg-glacier-200 overflow-hidden">
        <Image
          src={main}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((img, i) => (
            <button
              type="button"
              key={`${img}-${i}`}
              onClick={() => setActive(i)}
              className={`relative aspect-square overflow-hidden border-2 ${
                i === active
                  ? "border-mountain-800"
                  : "border-transparent hover:border-glacier-300"
              }`}
            >
              <Image src={img} alt="" fill className="object-cover" sizes="20vw" />
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
