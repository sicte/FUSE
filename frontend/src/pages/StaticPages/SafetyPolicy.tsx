import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    Shield,
    ShieldAlert,
    Baby,
    Eye,
    Flag,
    Lock,
    Database,
    Users,
    Gavel,
    Mail,
    AlertTriangle
} from "lucide-react";

import FeedbackModal from "../../components/FeedbackModal";
import GradientText from "../../reactbits/GradientText/GradientText";

function SafetyPolicy() {

    const [showFeedback, setShowFeedback] = useState(false);

    const sections = [
        {
            icon: <Baby size={22} />,
            title: "Child Safety & Protection 👶",
            items: [
                "FUSE has zero tolerance for child sexual abuse material (CSAM).",
                "Child exploitation, grooming, predatory behavior, and endangerment are strictly prohibited.",
                "Any content that harms or exploits minors will be removed immediately.",
                "Accounts involved in such activities may be permanently banned.",
                "We cooperate with law enforcement authorities when legally required."
            ]
        },
        {
            icon: <Users size={22} />,
            title: "Community Guidelines 🤝",
            items: [
                "Treat others with respect, even when you disagree.",
                "Harassment, bullying, hate speech, and abusive behavior are not allowed.",
                "Violence, threats, and illegal activities are prohibited.",
                "Spam, scams, impersonation, and fraud may result in enforcement action."
            ]
        },
        {
            icon: <Eye size={22} />,
            title: "User Generated Content 👀",
            items: [
                "Users can create profiles, publish posts, and communicate through chat.",
                "Reported content may be reviewed by moderators.",
                "Content violating our policies may be removed.",
                "Repeated violations may result in account restrictions or bans."
            ]
        },
        {
            icon: <Flag size={22} />,
            title: "Reporting Unsafe Content 🚩",
            items: [
                "Users can report harassment, abuse, spam, impersonation, and harmful content.",
                "Reports are reviewed as quickly as possible.",
                "Appropriate action is taken when policy violations are confirmed.",
                "Child safety reports receive immediate priority."
            ]
        },
        {
            icon: <Lock size={22} />,
            title: "Account Security 🔒",
            items: [
                "Keep your login credentials secure.",
                "Do not share passwords or sensitive personal information.",
                "Avoid sharing personal contact details publicly.",
                "Report suspicious activity immediately."
            ]
        },
        {
            icon: <Database size={22} />,
            title: "Privacy & Data Protection 🔐",
            items: [
                "We collect only information required to provide our services.",
                "Profile information, posts, and messages are handled according to our Privacy Policy.",
                "We do not sell personal user data.",
                "Users may request data deletion at any time."
            ]
        }
    ];

    return (
        <>
            <FeedbackModal
                isOpen={showFeedback}
                onClose={() => setShowFeedback(false)}
            />

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
                            Safety Policy
                        </GradientText>

                    </div>

                    <p className="mt-4 text-sm sm:text-base text-gray-300 max-w-2xl mx-auto">
                        Creating a safe, respectful, and secure environment
                        where people can connect, share, and build communities.
                    </p>

                </motion.div>

                {/* Child Safety Notice */}

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: .2 }}
                    className="
                        max-w-4xl
                        mx-auto
                        mt-10
                        rounded-2xl
                        border border-red-500/20
                        bg-red-500/10
                        backdrop-blur-md
                        p-6
                    "
                >

                    <div className="flex gap-4">

                        <div className="
                            p-3
                            rounded-xl
                            bg-red-500/20
                            text-red-400
                            h-fit
                        ">
                            <AlertTriangle size={24} />
                        </div>

                        <div>

                            <h2 className="font-bold text-xl mb-2 text-red-300">
                                Child Safety Notice
                            </h2>

                            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                                FUSE has zero tolerance for child sexual abuse,
                                child exploitation, grooming, predatory behavior,
                                or any activity that endangers minors.
                                Content or accounts involved in such activities
                                will be removed immediately and may be reported
                                to appropriate authorities when required.
                            </p>

                        </div>

                    </div>

                </motion.div>

                {/* Intro */}

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: .3 }}
                    className="
                        max-w-4xl
                        mx-auto
                        mt-8
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
                                Our Commitment To Safety
                            </h2>

                            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                                At FUSE, safety isn't just another checkbox.
                                We want people to share ideas, create content,
                                make friends, and participate in communities
                                without worrying about harassment, abuse,
                                exploitation, or harmful behavior.
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
                    md:grid-cols-2
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
                                delay: index * .1
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

                {/* Enforcement */}

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
                    "
                >

                    <div className="flex gap-4">

                        <div className="
                            p-3
                            rounded-xl
                            bg-yellow-500/10
                            text-yellow-400
                            h-fit
                        ">
                            <Gavel size={24} />
                        </div>

                        <div>

                            <h2 className="font-bold text-xl mb-4">
                                Enforcement Actions
                            </h2>

                            <ul className="space-y-3 text-gray-300 text-sm sm:text-base">

                                <li>• Content removal</li>
                                <li>• Warning notices</li>
                                <li>• Temporary restrictions</li>
                                <li>• Account suspension</li>
                                <li>• Permanent account bans</li>
                                <li>• Reporting to authorities when legally required</li>

                            </ul>

                        </div>

                    </div>

                </motion.div>

                {/* Contact */}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: .7 }}
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
                        Report Safety Concerns 📩
                    </h2>

                    <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                        If you encounter harmful content, harassment,
                        abuse, child safety concerns, impersonation,
                        or any policy violation, please contact us immediately.
                    </p>

                    <div className="mt-0">

                        <a
                            className="inline-block mt-4 text-cyan-400 hover:text-cyan-300 underline"
                            href="mailto:changexel.contacts@gmail.com"
                        >
                            changexel.contacts@gmail.com
                        </a>

                        <span className="text-gray-400 text-sm">
                            {" "}or{" "}
                        </span>

                        <span
                            className="text-cyan-400 underline hover:text-cyan-300 transition cursor-pointer"
                            onClick={() => setShowFeedback(true)}
                        >
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
                        We are committed to building a safe,
                        inclusive, and respectful platform
                        for everyone on FUSE 💙
                    </p>

                    <p className="mt-5 text-xs text-gray-500 italic">
                        Safety first. Good vibes second. Chaos only where appropriate ✨
                    </p>

                </motion.div>

            </div>
        </>
    );
}

export default React.memo(SafetyPolicy);