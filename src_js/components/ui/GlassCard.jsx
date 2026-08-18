import React from "react";
import { motion } from "motion/react";

export const GlassCard = ({
  children,
  className = "",
  hoverScale = true,
  onClick,
  id,
}) => {
  const content = (
    <div
      id={id}
      onClick={onClick}
      className={`glass-card p-5 bg-[rgba(255,255,255,0.02)] backdrop-blur-xl border border-[rgba(255,255,255,0.06)] rounded-2xl transition-all duration-200 ${
        onClick ? "cursor-pointer select-none" : ""
      } ${className}`}
    >
      {children}
    </div>
  );

  if (hoverScale) {
    return (
      <motion.div
        whileHover={{ scale: 1.02, translateY: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
        className="w-full"
      >
        {content}
      </motion.div>
    );
  }

  return content;
};

export default GlassCard;
