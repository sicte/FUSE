import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import loaderMessages from "../data/loader.json";
import { useAppSelector } from "../redux/hookStore";

function Loader() {
    const { isLoading } = useAppSelector((state) => state.loader);
    const [tip, setTip] = useState("");
    const [loadingText, setLoadingText] = useState("Loading");

    useEffect(() => {
        if (isLoading) {
            setTip(loaderMessages[Math.floor(Math.random() * loaderMessages.length)]);

            const dots = ["", ".", "..", "..."];
            let index = 0;

            const interval = setInterval(() => {
                setLoadingText(`Loading${dots[index]}`);
                index = (index + 1) % dots.length;
            }, 400);

            return () => clearInterval(interval);
        }
    }, [isLoading]);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    key="loader"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="fixed inset-0 z-99 flex flex-col items-center justify-center bg-black/20 backdrop-blur-sm text-white px-4"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="flex flex-col items-center gap-4 text-center"
                    >
                        <div className="w-12 h-12 sm:w-16 sm:h-16 border-[3px] sm:border-4 border-white border-t-transparent rounded-full animate-spin" />
                        <p className="text-base sm:text-lg font-semibold select-none">{loadingText}</p>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ delay: 0.6 }}
                        className="absolute bottom-8 sm:bottom-10 text-[11px] sm:text-sm text-gray-300 italic max-w-xs sm:max-w-md text-center select-none px-4"
                    >
                        {tip}
                    </motion.p>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default React.memo(Loader);