import React from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
    isOpen: boolean;
    message: string;
    onClose: () => void;
    onConfirm: () => void;
};

function Alert({ isOpen, message, onClose, onConfirm }: Props) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    role="dialog"
                    aria-modal="true"
                    onClick={onClose}>
                    <motion.div
                        className="bg-black/80 border border-white/10 text-white rounded-2xl w-full max-w-sm sm:max-w-md shadow-xl p-5 sm:p-6"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 22 }}>
                        <p className="text-sm sm:text-base text-white/90 break-words text-wrap">
                            {message}
                        </p>

                        <div className="mt-6 flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4">
                            <motion.button
                                onClick={onClose}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full sm:w-auto px-4 py-2 text-sm text-white/70 hover:text-white border border-white/20 rounded-lg transition">
                                Cancel
                            </motion.button>

                            <motion.button
                                onClick={() => {
                                    onConfirm();
                                    onClose();
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full sm:w-auto px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition">
                                Confirm
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default React.memo(Alert);