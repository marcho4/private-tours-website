"use client"

import ReviewCard from "./ReviewCard";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function Reviews() {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.2,
      });

    return (
        <div id="reviews" className="flex flex-col items-center justify-center w-full bg-zinc-100 relative z-20 overflow-hidden pb-5 sm:pb-15">
            <div className="flex flex-col items-center justify-center w-full max-w-6xl">
                <h1 className="text-4xl font-semibold w-full px-5 py-10 md:text-5xl lg:text-7xl italic text-left">
                    Отзывы
                </h1>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.5 }}
                >
                <ReviewCard degree={10} className="rotate-12 z-30" />
            </motion.div>
            <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.5 }}
                >
                <ReviewCard degree={10} className="-rotate-12" />                
            </motion.div>
            <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.5 }}
                >
                <ReviewCard degree={10} className="rotate-12  z-30" />
            </motion.div>
            <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.5 }}
                className="-rotate-12  z-30"
                >
                <ReviewCard degree={10} />                
            </motion.div>
            <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.5 }}
                className={" z-30"}
                >
                <ReviewCard degree={10} className="rotate-12" />                
            </motion.div>
            <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.5 }}
                className="-rotate-12 z-30"
                >
                <ReviewCard degree={10} />                
            </motion.div>
            </div>
        </div>
    )
}