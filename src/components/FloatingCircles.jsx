import { motion } from "framer-motion";

const FloatingCircles = () => {
  const circles = Array(8).fill(0).map((_, i) => ({
    size: Math.floor(Math.random() * 100) + 50,
    duration: Math.floor(Math.random() * 20) + 10,
    x: Math.random() * 100,
    y: Math.random() * 100,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {circles.map((circle, i) => (
        <motion.div
          key={i}
          initial={{ x: `${circle.x}vw`, y: `${circle.y}vh` }}
          animate={{
            x: [`${circle.x}vw`, `${circle.x + (Math.random() * 20 - 10)}vw`],
            y: [`${circle.y}vh`, `${circle.y + (Math.random() * 20 - 10)}vh`],
          }}
          transition={{
            duration: circle.duration,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          className={`absolute rounded-full bg-purple-200 opacity-20`}
          style={{ width: circle.size, height: circle.size }}
        />
      ))}
    </div>
  );
};

export default FloatingCircles;