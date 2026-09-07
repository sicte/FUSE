import React, { useState } from "react";
import { motion } from "framer-motion";
import { routeFeed } from "../../utils/Routes";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Home } from "lucide-react";
import FeedbackModal from "../../components/FeedbackModal";

function PageNotFound() {
  const navigate = useNavigate();
  const [showFeedback, setShowFeedback] = useState(false);

  return (
    <>
      <FeedbackModal isOpen={showFeedback} onClose={() => setShowFeedback(false)} />

      <div className="fixed inset-0 flex items-center justify-center px-4 select-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
          className="
                    w-full
                    max-w-md
                    rounded-3xl
                    border border-white/10
                    bg-black/30
                    backdrop-blur-md
                    shadow-2xl
                    overflow-hidden
                    p-6 sm:p-8
                    text-center
                "
        >
          <motion.div
            initial={{ rotate: -20, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{
              delay: 0.2,
              type: "spring",
              stiffness: 180
            }}
            className="flex justify-center mb-5"
          >
            <div className="p-4 rounded-full bg-red-500/20 border border-red-400/20">
              <AlertTriangle
                size={42}
                className="text-red-400"
              />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="
                        text-5xl
                        sm:text-6xl
                        font-bold
                        bg-gradient-to-r
                        from-pink-500
                        to-purple-600
                        bg-clip-text
                        text-transparent
                    "
          >
            404
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-white text-xl sm:text-2xl font-semibold mt-3"
          >
            Page Not Found
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-400 text-sm sm:text-base mt-3 leading-relaxed"
          >
            Looks like this page went on a vacation 🚀
            <br />
            Let's get you back home.
          </motion.p>

          <motion.button
            whileHover={{
              scale: 1.05
            }}
            whileTap={{
              scale: 0.95
            }}
            onClick={() => navigate(routeFeed)}
            className="
                        mt-8
                        inline-flex
                        items-center
                        gap-2
                        px-6
                        py-3
                        rounded-xl
                        text-white
                        font-semibold
                        bg-gradient-to-r
                        from-pink-500
                        to-purple-600
                        hover:from-pink-600
                        hover:to-purple-700
                        transition
                        shadow-lg
                    "
          >
            <Home size={18} />
            Go Home
          </motion.button>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-5"
          >

            <span className="text-sm text-gray-400">
              Found a broken route or weird bug?{" "}
            </span>

            <button
              onClick={() => setShowFeedback(true)}
              className="text-sm text-cyan-400 underline hover:text-cyan-300 transition cursor-pointer">
              Submit feedback
            </button>
          </motion.div>

        </motion.div>
      </div>
    </>
  );
}

export default React.memo(PageNotFound);