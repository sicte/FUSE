import React, { useState } from "react";
import { motion } from "framer-motion";
import FeedbackModal from "../../components/FeedbackModal";
import { Rocket, MessageCircle, Users, Sparkles } from "lucide-react";
import GradientText from "../../reactbits/GradientText/GradientText";

function AboutUs() {
    const [showFeedback, setShowFeedback] = useState(false);

    const cards = [
        {
            icon: <Rocket size={22} />,
            title: "Built From Chaos 🚀",
            text: "FUSE started as an ultimate timepass idea that somehow evolved into something real."
        },
        {
            icon: <MessageCircle size={22} />,
            title: "Post Freely 💭",
            text: "Thoughts, memes, chai-fueled breakdowns, random midnight ideas — everything belongs somewhere."
        },
        {
            icon: <Users size={22} />,
            title: "Find Your People 🔥",
            text: "From Bhagwan bharose devs to Moye-Moye enjoyers, there's always a community waiting."
        },
        {
            icon: <Sparkles size={22} />,
            title: "Pure Vibes ✨",
            text: "Chaos meets category. Vibing mandatory. Logic optional."
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
                    className="text-center">
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
                            About FUSE
                        </GradientText>
                    </div>

                    <p className="mt-4 text-gray-300 text-sm sm:text-base max-w-2xl mx-auto">
                        Where chaos meets category and random internet energy
                        somehow becomes a community.
                    </p>
                </motion.div>

                {/* Top cards */}
                <div className="max-w-6xl mx-auto mt-10 grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {cards.map((card, index) => (
                        <motion.div
                            key={card.title}
                            initial={{ opacity: 0, y: 25 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * .15 }}
                            whileHover={{ scale: 1.02 }}
                            className="rounded-2xl border border-white/10 bg-black/25 backdrop-blur-md p-6 shadow-xl">
                            <div className="w-fit p-3 rounded-xl bg-cyan-500/10 text-cyan-400 mb-4">
                                {card.icon}
                            </div>

                            <h2 className="font-bold text-lg mb-2">
                                {card.title}
                            </h2>

                            <p className="text-sm text-gray-300 leading-relaxed">
                                {card.text}
                            </p>

                        </motion.div>
                    ))}
                </div>

                {/* Main Story */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: .5 }}
                    className="max-w-4xl mx-auto mt-10 rounded-2xl border border-white/10 bg-black/20 backdrop-blur-md p-6 sm:p-8">

                    <h2 className="font-bold text-xl sm:text-2xl mb-5">Our Story</h2>

                    <div className="space-y-4 text-gray-300 text-sm sm:text-base leading-relaxed">
                        <p>
                            Welcome to FUSE — the ultimate timepass turned
                            tech startup that nobody asked for,
                            but here we are 🚀
                        </p>

                        <p>
                            Post your thoughts, rants, and chai-fueled
                            breakdowns in neat little categories
                            (yes, no more putting gym selfies under Tech).
                        </p>

                        <p>
                            It's like Instagram, but your mom isn't here.
                            Like Reddit, but nobody judges your grammar.
                            Like WhatsApp groups, but you can leave peacefully.
                        </p>

                        <p>
                            Want to vibe over "JCB ki khudai"?
                            From Bhagwan bharose devs to
                            Moye-Moye loving memers —
                            you'll find your people here 😭🔥
                        </p>

                        <p className="font-medium text-white">
                            FUSE = Where chaos meets category.
                            Vibing mandatory. Logic optional.
                        </p>
                    </div>
                </motion.div>

                {/* Contact */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: .7 }}
                    className="max-w-4xl mx-auto mt-8 rounded-2xl border border-white/10 bg-black/20 backdrop-blur-md p-6 text-center">

                    <h2 className="font-semibold mb-3">Contact Us 📩</h2>
                    <p className="text-gray-300 text-sm">Have questions, feedback, or random ideas?</p>

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
                <div className="max-w-4xl mx-auto mt-10 border-t border-white/10 pt-6 text-center">
                    <div className="text-sm text-gray-400">
                        Developed by{" "}
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
                            className="inline font-semibold"
                        >
                            -DK-
                        </GradientText>

                    </div>

                    <div className="text-xs text-gray-500 mt-2">
                        Made with ☕ + 💻 + questionable midnight ideas
                    </div>

                </div>
            </div>
        </>
    );
}

export default React.memo(AboutUs);