import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send } from "lucide-react";

import { setLoader } from "../redux/sliceLoader";
import { setMessageBar } from "../redux/sliceMessageBar";
import { useAppDispatch, useAppSelector } from '../redux/hookStore';

import ColorManager from "../utils/ColorManager";
import { postRequest } from "../api/APIManager";
import { urlFeedback } from "../api/APIs";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const [feedback, setFeedback] = useState("");

  function BackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  async function SubmitFeedback() {
    const feedbackValue = feedback.trim();
    if (feedbackValue.length < 1) return;
    
    dispatch(setLoader({ isLoading: true }));
    
    const body: { feedback: string; userId?: number; } = { feedback: feedbackValue };
    if (user?.id) body.userId = user.id;
    
    const { data, error } = await postRequest<string>(urlFeedback, body);

    if (data) {
      dispatch(setMessageBar({ message: data, color: ColorManager.msgSuccess }))
      setFeedback("");
      onClose();
    }
    else if (error) {
      dispatch(setMessageBar({ message: error, color: ColorManager.msgError }))
    }

    dispatch(setLoader({ isLoading: false }));
  }

  return (
    <AnimatePresence>

      {isOpen && (

        <motion.div
          onClick={BackdropClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-md"
        >

          <motion.div
            initial={{ opacity: 0, scale: .9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: .95, y: 20 }}
            transition={{ duration: .3 }}
            className="relative w-full max-w-2xl min-h-[60vh] rounded-2xl border border-white/20 bg-black/25 backdrop-blur-2xl shadow-2xl p-7 text-white overflow-hidden flex flex-col"
          >
            {/* Glow */}
            <div
              className="absolute -top-12 left-1/2 -translate-x-1/2 h-32 w-32 rounded-full bg-cyan-500/20 blur-3xl"
            />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-5 text-3xl font-bold text-gray-300 hover:text-cyan-400 transition cursor-pointer"
            >
              &times;
            </button>

            {/* Header */}
            <div className="flex flex-col items-center">

              <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 mb-3">
                <MessageSquare size={24} />
              </div>

              <h2 className="text-3xl font-bold text-center">
                Submit Feedback
              </h2>

              <p className="mt-2 text-sm text-gray-400 text-center">
                Roast us, praise us, suggest ideas,or tell us what broke 😭
              </p>

            </div>

            {/* Textarea */}
            <div className="mt-6 flex-1">
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="
Tell us your thoughts...

• Found a bug?
• Want a feature?
• Random midnight idea?
• Or just vibing?"
                className="w-full h-full min-h-[280px] rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md px-5 py-4 text-sm text-white outline-none resize-none custom-scroll placeholder:text-gray-500 focus:border-cyan-500 focus:bg-white/10 focus:shadow-lg focus:shadow-cyan-500/10 transition-all" />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center mt-6">

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: .95 }}
                onClick={() => SubmitFeedback()}
                className="flex items-center gap-2 px-8 py-3 rounded-xl bg-cyan-500 text-black font-semibold hover:bg-cyan-400 transition cursor-pointer">
                <Send size={18} />
                Submit
              </motion.button>

            </div>

          </motion.div>

        </motion.div>

      )}

    </AnimatePresence>
  );
}

export default React.memo(FeedbackModal);