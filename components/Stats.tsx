"use client";

import { motion } from "framer-motion";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

const stats = [
  {
    num: 1,
    text: "Year of experience",
    suffix: "+",
  },
  {
    num: 16,
    text: "Projects completed",
    suffix: "+",
  },
  {
    num: 8,
    text: "Technologies mastered",
    suffix: "+",
  },
  {
    num: 173,
    text: "Github contributions",
    suffix: "",
  },
];

const Stats = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="py-20" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{
                delay: index * 0.1,
                duration: 0.5,
                type: "spring",
              }}
              className="group"
            >
              <div className="relative flex flex-col items-center p-6 rounded-2xl border border-border bg-card/30 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 hover:scale-105">
                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/0 via-accent/0 to-primary/0 opacity-0 group-hover:opacity-10 transition-opacity" />
                
                <div className="relative z-10 text-center">
                  <div className="flex items-baseline justify-center mb-2">
                    {inView && (
                      <CountUp
                        end={item.num}
                        duration={2.5}
                        delay={index * 0.1}
                        className="text-5xl md:text-6xl font-bold bg-gradient-to-br from-primary via-accent to-primary bg-clip-text text-transparent"
                      />
                    )}
                    <span className="text-4xl md:text-5xl font-bold text-primary ml-1">
                      {item.suffix}
                    </span>
                  </div>
                  <p className="text-sm md:text-base text-muted-foreground font-medium">
                    {item.text}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
