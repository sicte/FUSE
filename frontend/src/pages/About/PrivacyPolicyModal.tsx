import React from "react";

interface PrivacyPolicyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

function PrivacyPolicyModal({ isOpen, onClose }: PrivacyPolicyModalProps) {
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

                <h2 className="text-2xl sm:text-3xl font-bold mb-4">Privacy Policy 🕵️‍♀️</h2>

                <div className="text-sm sm:text-base leading-relaxed space-y-4 pr-1 sm:pr-2">
                    <p>
                        At FUSE, your data is safer than your childhood crush's secret. We take your privacy seriously — because even we don't want our embarrassing memes leaked.
                    </p>

                    <div>
                        <p className="mb-1">🔐 What we collect:</p>
                        <ul className="list-disc list-inside pl-4">
                            <li>Name, email, and profile details</li>
                            <li>Your posts, likes, and comments (including your "rizz" attempts)</li>
                            <li>Some device data, but no spying. We're not CID.</li>
                        </ul>
                    </div>

                    <div>
                        <p className="mb-1">👀 What we do with it:</p>
                        <ul className="list-disc list-inside pl-4">
                            <li>Keep the app smooth like Amul butter</li>
                            <li>Improve your experience and recommend spicy memes</li>
                            <li>Absolutely NEVER sell your data. Not even for biryani.</li>
                        </ul>
                    </div>

                    <div>
                        <p className="mb-1">🧹 Your control:</p>
                        <ul className="list-disc list-inside pl-4">
                            <li>You can delete your account anytime (but we'll miss you 💔)</li>
                            <li>You control what you post. Just don't post your Aadhaar, please 🙏</li>
                        </ul>
                    </div>

                    <p>
                        Basically, your data is yours. We're just the babysitters making sure it doesn't eat glue.
                    </p>
                    <p>
                        *Note: If this policy ever changes, we'll update it faster than you can say "Nikal launde... privacy ka time aa gaya hai" 🫡
                    </p>
                </div>
            </div>
        </div>
    );
}

export default React.memo(PrivacyPolicyModal);