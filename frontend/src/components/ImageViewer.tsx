import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

import { setMessageBar } from "../redux/sliceMessageBar";
import { useAppDispatch } from "../redux/hookStore";
import GetMessage from "../utils/MessagesManager";
import ColorManager from "../utils/ColorManager";

interface ImageViewerProps {
    imageUrl: string;
    onClose: () => void;
}

function ImageViewer({ imageUrl, onClose }: ImageViewerProps) {
    const dispatch = useAppDispatch();
    const backdropRef = useRef<HTMLDivElement>(null);

    function ButtonBack(e: React.MouseEvent<HTMLDivElement>) {
        if (e.target === backdropRef.current) {
            onClose();
        }
    }

    async function DownloadImage() {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = imageUrl.split("/").pop() || "image.jpg";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            dispatch(setMessageBar({ message: GetMessage('imageDownloadSuccess'), color: ColorManager.msgSuccess }));
        } catch (error) {
            console.error("Download failed:", error);
            dispatch(setMessageBar({ message: GetMessage('imageDownloadFail'), color: ColorManager.msgError }));
        }
    }

    return (
        <AnimatePresence>
            <motion.div
                ref={backdropRef}
                onClick={ButtonBack}
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
            >
                <motion.div
                    className="relative w-full sm:max-w-xl aspect-video bg-black/50 backdrop-blur-sm rounded-xl overflow-hidden border-1 border-blue-500/20 shadow-xl"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}>
                    <motion.img
                        src={imageUrl}
                        alt="Full view"
                        className="w-full h-full object-contain p-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                    />

                    <motion.button
                        onClick={onClose}
                        className="absolute top-2 right-2 text-white hover:text-red-400 transition-colors z-10 bg-black/50 p-1 rounded-full"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileTap={{ scale: 1.05 }}
                        whileHover={{ scale: 0.95 }}
                        transition={{ delay: 0.2 }}>
                        <X size={24} />
                    </motion.button>

                    <motion.button
                        onClick={DownloadImage}
                        className="absolute bottom-2 right-2 bg-white text-black font-medium px-3 py-1.5 rounded-md hover:bg-green-400 transition z-10"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileTap={{ scale: 1.05 }}
                        whileHover={{ scale: 0.95 }}
                        transition={{ delay: 0.3 }}>
                        Download
                    </motion.button>
                    
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

export default React.memo(ImageViewer);