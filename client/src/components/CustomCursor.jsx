import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const checkMobile = () => {
      const mobile = window.innerWidth < 1024 || navigator.maxTouchPoints > 0;
      setIsMobile(mobile);
      return mobile;
    };

    const mobile = checkMobile();
    window.addEventListener("resize", checkMobile);

    if (mobile) {
      return () => window.removeEventListener("resize", checkMobile);
    }

    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      if (
        e.target.tagName.toLowerCase() === "button" ||
        e.target.tagName.toLowerCase() === "a" ||
        e.target.closest("button") ||
        e.target.closest("a") ||
        e.target.classList.contains("interactive")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", updateMousePosition, {
      passive: true,
    });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });

    // Esconde o cursor padrão do sistema globalmente
    document.body.style.cursor = "none";
    const style = document.createElement("style");
    style.innerHTML = `* { cursor: none !important; }`;
    document.head.appendChild(style);

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
      document.body.style.cursor = "auto";
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  if (!isMounted || isMobile) return null;

  const variants = {
    default: {
      x: mousePosition.x - 250,
      y: mousePosition.y - 250,
      height: 500,
      width: 500,
      background:
        "radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(59,130,246,0) 50%)",
      mixBlendMode: "screen",
      border: "none",
    },
    hover: {
      x: mousePosition.x - 300,
      y: mousePosition.y - 300,
      height: 600,
      width: 600,
      background:
        "radial-gradient(circle, rgba(99,102,241,0.25) 0%, rgba(99,102,241,0) 50%)",
      mixBlendMode: "screen",
      border: "none",
    },
  };

  const dotVariants = {
    default: {
      x: mousePosition.x - 8,
      y: mousePosition.y - 8,
      height: 16,
      width: 16,
      backgroundColor: "rgba(59, 130, 246, 0.8)",
      border: "2px solid rgba(255, 255, 255, 0.8)",
      mixBlendMode: "normal",
    },
    hover: {
      x: mousePosition.x - 24,
      y: mousePosition.y - 24,
      height: 48,
      width: 48,
      backgroundColor: "rgba(59, 130, 246, 0.2)",
      border: "1px solid rgba(59, 130, 246, 0.5)",
      mixBlendMode: "screen",
    },
  };

  return createPortal(
    <div
      style={{
        pointerEvents: "none",
        position: "fixed",
        inset: 0,
        zIndex: 2147483647,
      }}
    >
      {/* Luz de projeção grande (SaaS Premium Glow) */}
      <motion.div
        variants={variants}
        animate={isHovering ? "hover" : "default"}
        transition={{ type: "tween", ease: "backOut", duration: 0.15 }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          borderRadius: "50%",
          pointerEvents: "none",
          willChange: "transform",
        }}
      />

      {/* Esfera do cursor real (Ponteiro) */}
      <motion.div
        variants={dotVariants}
        animate={isHovering ? "hover" : "default"}
        transition={{ type: "tween", ease: "backOut", duration: 0.1 }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          borderRadius: "50%",
          pointerEvents: "none",
          boxShadow: "0 0 10px rgba(59, 130, 246, 0.8)",
          willChange: "transform",
        }}
      />
    </div>,
    document.body,
  );
};

export default CustomCursor;
