import './components.css';

import React, { useState, useRef, useEffect } from "react";
import { useAppSelector } from '../redux/hookStore';
import { AnimatePresence, motion } from 'framer-motion';

function MessageBar() {
    const { message, color, key } = useAppSelector((state) => state.messageBar);
    const [msg, setMsg] = useState('');
    const [msgColor, setMsgColor] = useState('white');
    const [animationKey, setAnimationKey] = useState(0);
    const msgTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const disableTime = 5000;

    function ShowMsg() {
        setMsg(message);
        setMsgColor(color);
        setAnimationKey(prev => prev + 1);

        if (msgTimer.current) clearTimeout(msgTimer.current);
        if (!message) return;

        msgTimer.current = setTimeout(() => { setMsg(''); }, disableTime);
    }

    useEffect(() => {
        ShowMsg();
    }, [key]);

    return (
        <AnimatePresence>
            {msg && (
                <motion.div
                    key={animationKey}
                    initial={{ opacity: 0, scale: 1, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 1, y: 50 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                    className="fixed bottom-16 w-full flex justify-center z-100 pointer-events-none px-4">
                    <div className="MessageBar bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl border border-white/15 shadow-md max-w-md w-full pointer-events-auto">
                        <p
                            className="text-center font-semibold text-white text-sm sm:text-base md:text-lg select-none"
                            style={{ color: msgColor }}>
                            {msg}
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default React.memo(MessageBar);
