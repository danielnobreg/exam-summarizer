import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
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

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);

    // Esconde o cursor padrão do sistema na HomePage
    document.body.style.cursor = "none";

    // Cria um estilo global para forçar o cursor nativo a não aparecer sobre nenhum elemento
    const style = document.createElement("style");
    style.innerHTML = `
      * {
        cursor: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
      document.body.style.cursor = "auto";
      document.head.removeChild(style);
    };
  }, []);

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

  return (
    <>
      {/* Luz de projeção grande (SaaS Premium Glow) */}
      <motion.div
        variants={variants}
        animate={isHovering ? "hover" : "default"}
        transition={{ type: "tween", ease: "backOut", duration: 0.15 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 9998,
        }}
      />

      {/* Esfera do cursor real (Ponteiro) */}
      <motion.div
        variants={dotVariants}
        animate={isHovering ? "hover" : "default"}
        transition={{ type: "tween", ease: "backOut", duration: 0.1 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 9999,
          boxShadow: "0 0 10px rgba(59, 130, 246, 0.8)",
        }}
      />
    </>
  );
};

export default CustomCursor;
