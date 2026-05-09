"use client";

import { motion } from "motion/react";
import { Mic } from "lucide-react";

export default function FloatingActionButton() {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-8 right-8 btn btn-primary btn-circle w-14 h-14 shadow-lg border-2 border-white/20"
    >
      <Mic size={28} />
    </motion.button>
  );
}
