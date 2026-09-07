import React, { useState } from "react";
import { motion } from "framer-motion";
import { FileText, AlertTriangle, Copyright, Brain, Mail } from "lucide-react";
import FeedbackModal from "../../components/FeedbackModal";
import GradientText from "../../reactbits/GradientText/GradientText";

function TermsAndConditions() {
    const [showFeedback, setShowFeedback] = useState(false);

    const sections = [
        {
            icon: <AlertTriangle size={22} />,
            title: "By Using This App ⚠️",
            items: [
                `Not post anything your nani wouldn't approve of 👵`,
                "No spamming, unless it's actual canned spam pics",
                "Respect others. Or at least pretend like you do"
            ]
        },
        {
            icon: <Copyright size={22} />,
            title: "Content Rights 📦",
            items: [
                "You own your content",
                "We just showcase it, like those talent shows your mom forced you into",
                "If your meme goes viral, tag us bro. Don't ghost."
            ]
        },
        {
            icon: <Brain size={22} />,
            title: "Intellectual Property 🧠",
            items: [
                "Our code, logo, and app design are ours",
                "Stealing it will not bring you peace",
                "Only lawyer notices 📬"
            ]
        }
    ];

    return (
        <>
            <FeedbackModal isOpen={showFeedback} onClose={() => setShowFeedback(false)} />

            <div className="w-full h-full overflow-y-auto custom-scroll px-4 py-6 text-white select-none">

                {/* Header */}

                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: .6 }}
                    className="text-center"
                >
                    <div className="text-4xl sm:text-6xl font-bold">

                        <GradientText
                            colors={[
                                "#40ffaa",
                                "#4079ff",
                                "#40ffaa",
                                "#4079ff",
                                "#40ffaa"
                            ]}
                            animationSpeed={6}
                            showBorder={false}
                        >
                            Terms & Conditions
                        </GradientText>

                    </div>

                    <p className="mt-4 text-sm sm:text-base text-gray-300 max-w-2xl mx-auto">
                        Chaos meets category and your memes matter more than your resume 📜
                    </p>

                </motion.div>


                {/* Intro */}

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: .2 }}
                    className="
                    max-w-4xl
                    mx-auto
                    mt-10
                    rounded-2xl
                    border border-white/10
                    bg-black/20
                    backdrop-blur-md
                    p-6
                "
                >

                    <div className="flex gap-4">

                        <div className="
                        p-3
                        rounded-xl
                        bg-cyan-500/10
                        text-cyan-400
                        h-fit
                    ">
                            <FileText size={24} />
                        </div>

                        <div>

                            <h2 className="font-bold text-xl mb-2">
                                Welcome To FUSE
                            </h2>

                            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                                Welcome to FUSE — the app where chaos meets
                                category and your memes matter more than your resume.
                            </p>

                        </div>

                    </div>

                </motion.div>


                {/* Main Cards */}

                <div className="
                max-w-6xl
                mx-auto
                mt-8
                grid
                grid-cols-1
                md:grid-cols-3
                gap-5
            ">

                    {sections.map((section, index) => (

                        <motion.div
                            key={section.title}
                            initial={{
                                opacity: 0,
                                y: 30
                            }}
                            animate={{
                                opacity: 1,
                                y: 0
                            }}
                            transition={{
                                delay: index * .15
                            }}
                            whileHover={{
                                scale: 1.02
                            }}
                            className="
                            rounded-2xl
                            border border-white/10
                            bg-black/25
                            backdrop-blur-md
                            p-6
                            shadow-xl
                        "
                        >

                            <div className="
                            w-fit
                            p-3
                            rounded-xl
                            bg-cyan-500/10
                            text-cyan-400
                            mb-4
                        ">
                                {section.icon}
                            </div>

                            <h2 className="font-bold text-lg mb-4">
                                {section.title}
                            </h2>

                            <ul className="space-y-3">

                                {section.items.map(item => (

                                    <li
                                        key={item}
                                        className="
                                        flex
                                        gap-2
                                        text-sm
                                        text-gray-300
                                    "
                                    >
                                        <span className="text-cyan-400">
                                            •
                                        </span>

                                        {item}

                                    </li>

                                ))}

                            </ul>

                        </motion.div>

                    ))}

                </div>


                {/* Support */}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: .6 }}
                    className="
                    max-w-4xl
                    mx-auto
                    mt-8
                    rounded-2xl
                    border border-white/10
                    bg-black/20
                    backdrop-blur-md
                    p-6
                    text-center
                "
                >

                    <div className="flex justify-center mb-4 text-cyan-400">
                        <Mail size={24} />
                    </div>

                    <h2 className="font-semibold text-lg mb-3">
                        Need Help? 📩
                    </h2>

                    <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                        Have questions regarding terms, account issues,
                        or want to request data/account deletion?
                        Feel free to contact us anytime.
                    </p>

                    <div className="mt-0">
                        <a className="inline-block mt-4 text-cyan-400 hover:text-cyan-300 underline"
                            href="mailto:changexel.contacts@gmail.com">
                            changexel.contacts@gmail.com
                        </a>

                        <span className="text-gray-400 text-sm">
                            {" "}or{" "}
                        </span>

                        <span className="text-cyan-400 underline hover:text-cyan-300 transition cursor-pointer"
                            onClick={() => setShowFeedback(true)}>
                            submit feedback
                        </span>
                    </div>

                </motion.div>


                {/* Footer */}

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: .8 }}
                    className="
                    max-w-4xl
                    mx-auto
                    mt-8
                    rounded-2xl
                    border border-white/10
                    bg-black/20
                    backdrop-blur-md
                    p-6
                    text-center
                "
                >

                    <p className="text-sm sm:text-base text-gray-300">
                        The app is provided as-is.
                        If it breaks, cries, or refuses to load —
                        blame the nearest Mercury retrograde 🌌
                    </p>

                    <p className="mt-5 text-sm text-gray-300">
                        If you agree to these terms, swipe right.
                        Just kidding — enjoy responsibly 🙃
                    </p>

                    <p className="mt-5 text-xs text-gray-500 italic">
                        *Violators may be banned, or worse,
                        turned into a meme 😎*
                    </p>

                </motion.div>

            </div>
        </>
    );
}

export default React.memo(TermsAndConditions);