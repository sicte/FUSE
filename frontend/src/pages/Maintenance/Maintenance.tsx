import React, { useMemo, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { RefreshCcw } from "lucide-react";
import { routeFeed } from "../../utils/Routes";
import maintenanceMessages from "../../data/maintenanceMessages.json";

const Maintenance = () => {
    const [loading, setLoading] = useState(false);

    const message = useMemo(() => {
        const index = Math.floor(Math.random() * maintenanceMessages.length);
        return maintenanceMessages[index];
    }, []);

    const handleRetry = () => {
        setLoading(true);
        setTimeout(() => {
            window.location.replace(routeFeed);
        }, 500);
    };

    const containerVariants: Variants = {
        hidden: { opacity: 0, scale: 0.95, y: 30 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut",
            },
        },
        exit: {
            opacity: 0,
            scale: 0.9,
            y: 30,
            transition: { duration: 0.5, ease: "easeIn" },
        },
    };

    return (
        <div className="absolute inset-0 h-screen overflow-y-auto flex items-center justify-center bg-transparent z-50 pointer-events-none select-none">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="w-[90%] sm:w-96 px-4 sm:px-6 pt-6 pb-6 rounded-2xl pointer-events-auto relative overflow-hidden border border-white/10 shadow-xl bg-black/30 backdrop-blur-md"
            >
                <div className="text-center px-2 relative z-10">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="text-white text-2xl font-bold mb-2"
                    >
                        {message.title}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="text-sm text-gray-300 mb-5"
                    >
                        {message.subtitle}
                    </motion.p>

                    <motion.button
                        whileHover={!loading ? { scale: 1.05 } : {}}
                        whileTap={!loading ? { scale: 0.95 } : {}}
                        disabled={loading}
                        onClick={handleRetry}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold text-sm transition shadow-md ${loading
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:from-pink-600 hover:to-purple-700"
                            }`}
                    >
                        <motion.div
                            animate={loading ? { rotate: 360 } : false}
                            transition={{
                                repeat: Infinity,
                                duration: 1.5,
                                ease: "linear",
                            }}
                        >
                            <RefreshCcw className="w-4 h-4" />
                        </motion.div>
                        {loading ? "Reloading..." : "Try Again"}
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};

export default React.memo(Maintenance);
