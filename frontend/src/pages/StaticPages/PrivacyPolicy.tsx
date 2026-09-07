import React, { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Database, Eye, Settings, Mail } from "lucide-react";
import FeedbackModal from "../../components/FeedbackModal";
import GradientText from "../../reactbits/GradientText/GradientText";

function PrivacyPolicy() {
    const [showFeedback, setShowFeedback] = useState(false);

    const sections = [
        {
            icon: <Database size={22} />,
            title: "What We Collect 🔐",
            items: [
                "Name, email, and profile details",
                `Your posts, likes, and comments (including your "rizz" attempts)`,
                "Some device data, but no spying. We're not CID."
            ]
        },
        {
            icon: <Eye size={22} />,
            title: "What We Do With It 👀",
            items: [
                "Keep the app smooth like Amul butter",
                "Improve your experience and recommend spicy memes",
                "Absolutely NEVER sell your data. Not even for biryani."
            ]
        },
        {
            icon: <Settings size={22} />,
            title: "Your Control 🧹",
            items: [
                "Delete your account anytime (but we'll miss you 💔)",
                "You control what you post",
                "Please don't post your Aadhaar 🙏"
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
                            Privacy Policy
                        </GradientText>

                    </div>

                    <p className="mt-4 text-sm sm:text-base text-gray-300 max-w-2xl mx-auto">
                        Your data is safer than your childhood crush's secret 🕵️‍♀️
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
                            <Shield size={24} />
                        </div>

                        <div>

                            <h2 className="font-bold text-xl mb-2">
                                We Take Privacy Seriously
                            </h2>

                            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                                At FUSE, your data is safer than your childhood
                                crush's secret. We take privacy seriously —
                                because even we don't want our embarrassing
                                memes leaked.
                            </p>

                        </div>

                    </div>

                </motion.div>


                {/* Cards */}

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
                        Want to delete your account data, remove information,
                        or have any privacy-related questions?
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
                        Basically, your data is yours.
                        We're just the babysitters making sure
                        it doesn't eat glue 😭
                    </p>

                    <p className="mt-5 text-xs text-gray-500 italic">
                        *If this policy ever changes, we'll update it faster than
                        you can say "Nikal launde... privacy ka time aa gaya hai" 🫡
                    </p>

                </motion.div>

            </div>
        </>
    );
}

export default React.memo(PrivacyPolicy);