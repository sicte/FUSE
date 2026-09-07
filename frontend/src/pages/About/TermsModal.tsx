import React from "react";

interface TermsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

function TermsModal({ isOpen, onClose }: TermsModalProps) {
    if (!isOpen) return null;

    function BackdropClick(e: React.MouseEvent<HTMLDivElement>) {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center px-2 sm:px-4"
            onClick={BackdropClick}
        >
            <div className="bg-white/10 backdrop-blur-2xl border border-white/20 text-white w-full max-w-lg sm:max-w-2xl rounded-xl shadow-xl p-4 sm:p-6 relative overflow-y-auto max-h-[85vh] custom-scroll">

                <button
                    onClick={onClose}
                    className="absolute top-3 right-4 text-white hover:text-cyan-400 text-2xl sm:text-xl font-bold">
                    &times;
                </button>

                <h2 className="text-2xl sm:text-3xl font-bold mb-4">Terms & Conditions 📜</h2>

                <div className="text-sm sm:text-base leading-relaxed space-y-4 pr-1 sm:pr-2">
                    <p>
                        Welcome to FUSE — the app where chaos meets category and your memes matter more than your resume.
                    </p>

                    <div>
                        <p className="mb-1">⚠️ By using this app, you agree to:</p>
                        <ul className="list-disc list-inside pl-4">
                            <li>Not post anything your nani wouldn't approve of 👵</li>
                            <li>No spamming, unless it's actual canned spam pics</li>
                            <li>Respect others. Or at least pretend like you do</li>
                        </ul>
                    </div>

                    <p>
                        🛠 The app is provided as-is. If it breaks, cries, or refuses to load — just blame the nearest Mercury retrograde 🌌
                    </p>

                    <div>
                        <p className="mb-1">📦 Content Rights:</p>
                        <ul className="list-disc list-inside pl-4">
                            <li>You own your content. We just showcase it, like those talent shows your mom forced you into.</li>
                            <li>If your meme goes viral, tag us bro. Don’t ghost.</li>
                        </ul>
                    </div>

                    <div>
                        <p className="mb-1">🧠 Intellectual Property:</p>
                        <ul className="list-disc list-inside pl-4">
                            <li>Our code, logo, and app design are ours. Stealing it will not bring you peace, only lawyer notices 📬</li>
                        </ul>
                    </div>

                    <p>
                        If you agree to these terms, swipe right. Just kidding — click "close" and enjoy responsibly 🙃
                    </p>
                    <p>
                        *Note: Violators may be banned, or worse, turned into a meme.* 😎
                    </p>
                </div>
            </div>
        </div>
    );
}

export default React.memo(TermsModal);