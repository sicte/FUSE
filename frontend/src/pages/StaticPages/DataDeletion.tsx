import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Trash2,
  ShieldAlert,
  Database,
  UserX,
  Mail,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

import { setLoader } from "../../redux/sliceLoader";
import { setMessageBar } from "../../redux/sliceMessageBar";
import { useAppDispatch } from '../../redux/hookStore';

import ColorManager from "../../utils/ColorManager";
import FeedbackModal from "../../components/FeedbackModal";
import GradientText from "../../reactbits/GradientText/GradientText";

import { urlDatadeletion } from "../../api/APIs";
import { postRequest } from "../../api/APIManager";

type DeleteType =
  | "some-data"
  | "temporary-delete"
  | "permanent-delete"
  | "delete-account";

function DataDeletion() {
  const dispatch = useAppDispatch();
  const [showFeedback, setShowFeedback] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [details, setDetails] = useState("");
  const [deleteType, setDeleteType] =
    useState<DeleteType>("some-data");

  const options = [
    {
      id: "some-data",
      title: "Delete Some Data",
      desc: "Posts, comments, likes, profile info, etc.",
      icon: <Database size={20} />,
      color: "text-cyan-400 bg-cyan-500/10"
    },
    {
      id: "temporary-delete",
      title: "Temporary Account Deletion",
      desc: "Deactivate account for some time",
      icon: <ShieldAlert size={20} />,
      color: "text-yellow-400 bg-yellow-500/10"
    },
    {
      id: "permanent-delete",
      title: "Permanent Data Deletion",
      desc: "Delete all your personal data permanently",
      icon: <Trash2 size={20} />,
      color: "text-red-400 bg-red-500/10"
    },
    {
      id: "delete-account",
      title: "Delete Complete Account",
      desc: "Remove your account and all related data",
      icon: <UserX size={20} />,
      color: "text-pink-400 bg-pink-500/10"
    }
  ];

  async function sendRequest() {

    if (!username.trim()) {
      dispatch(setMessageBar({
        message: "Username is required",
        color: ColorManager.msgError
      }));

      return;
    }

    if (!email.trim()) {
      dispatch(setMessageBar({
        message: "Email is required",
        color: ColorManager.msgError
      }));

      return;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      dispatch(setMessageBar({
        message: "Please enter valid email",
        color: ColorManager.msgError
      }));

      return;
    }

    if (!details.trim()) {
      dispatch(setMessageBar({
        message: "Please enter deletion details",
        color: ColorManager.msgError
      }));

      return;
    }

    dispatch(setLoader({ isLoading: true }));

    const body = {
      username: username.trim(),
      email: email.trim(),
      details: details.trim(),
      deleteType
    };

    const { data, error } =
      await postRequest<string>(
        urlDatadeletion,
        body
      );

    if (data) {

      dispatch(setMessageBar({
        message: data,
        color: ColorManager.msgSuccess
      }));

      setUsername("");
      setEmail("");
      setDetails("");
      setDeleteType("some-data");

    }
    else if (error) {

      dispatch(setMessageBar({
        message: error,
        color: ColorManager.msgError
      }));

    }

    dispatch(setLoader({ isLoading: false }));
  }

  return (
    <>
      <FeedbackModal
        isOpen={showFeedback}
        onClose={() => setShowFeedback(false)}
      />

      <div className="
                w-full
                h-full
                overflow-y-auto
                custom-scroll
                px-4
                py-6
                text-white
                select-none
            ">

        {/* Header */}

        <motion.div
          initial={{
            opacity: 0,
            y: -30
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            duration: .6
          }}
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
              Data Deletion
            </GradientText>

          </div>

          <p className="
                        mt-4
                        text-sm
                        sm:text-base
                        text-gray-300
                        max-w-2xl
                        mx-auto
                    ">
            Control your data, your account,
            and your privacy — because your
            digital life belongs to you 🔐
          </p>

        </motion.div>

        {/* Intro Card */}

        <motion.div
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          transition={{
            delay: .2
          }}
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
                            bg-red-500/10
                            text-red-400
                            h-fit
                        ">
              <Trash2 size={24} />
            </div>

            <div>

              <h2 className="
                                font-bold
                                text-xl
                                mb-2
                            ">
                Request Data or Account Deletion
              </h2>

              <p className="
                                text-sm
                                sm:text-base
                                text-gray-300
                                leading-relaxed
                            ">
                You can request deletion of specific data,
                temporary account deactivation,
                permanent data removal,
                or complete account deletion.
                Just fill the details below and send us
                an email request 📩
              </p>

            </div>

          </div>

        </motion.div>

        {/* Options */}

        <div className="
                    max-w-6xl
                    mx-auto
                    mt-8
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    gap-5
                ">

          {options.map((option, index) => {

            const active = deleteType === option.id;

            return (
              <motion.button
                key={option.id}
                initial={{
                  opacity: 0,
                  y: 25
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                transition={{
                  delay: index * .12
                }}
                whileHover={{
                  scale: 1.02
                }}
                whileTap={{
                  scale: .98
                }}
                onClick={() =>
                  setDeleteType(option.id as DeleteType)
                }
                className={`
                                    text-left
                                    rounded-2xl
                                    border
                                    backdrop-blur-md
                                    p-6
                                    transition-all
                                    ${active
                    ? "border-cyan-400/40 bg-cyan-500/10"
                    : "border-white/10 bg-black/25"
                  }
                                `}
              >

                <div className={`
                                    w-fit
                                    p-3
                                    rounded-xl
                                    mb-4
                                    ${option.color}
                                `}>
                  {option.icon}
                </div>

                <div className="
                                    flex
                                    items-center
                                    justify-between
                                    gap-3
                                ">

                  <h2 className="
                                        font-semibold
                                        text-lg
                                    ">
                    {option.title}
                  </h2>

                  {active && (
                    <CheckCircle2
                      size={20}
                      className="text-cyan-400"
                    />
                  )}

                </div>

                <p className="
                                    mt-2
                                    text-sm
                                    text-gray-300
                                ">
                  {option.desc}
                </p>

              </motion.button>
            );
          })}

        </div>

        {/* Form */}

        <motion.div
          initial={{
            opacity: 0,
            y: 30
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            delay: .5
          }}
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

          <div className="
                        flex
                        items-center
                        gap-3
                        mb-6
                    ">

            <div className="
                            p-3
                            rounded-xl
                            bg-cyan-500/10
                            text-cyan-400
                        ">
              <Mail size={22} />
            </div>

            <div>

              <h2 className="
                                font-bold
                                text-xl
                            ">
                Submit Request
              </h2>

              <p className="
                                text-sm
                                text-gray-400
                            ">
                Fill your details before sending email
              </p>

            </div>

          </div>

          <div className="
                        grid
                        grid-cols-1
                        sm:grid-cols-2
                        gap-5
                    ">

            <div>

              <label className="
                                text-sm
                                text-gray-300
                                mb-2
                                block
                            ">
                Username
              </label>

              <input
                type="text"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
                placeholder="@your_username"
                className="
                                    w-full
                                    rounded-xl
                                    border border-white/10
                                    bg-white/5
                                    px-4
                                    py-3
                                    text-sm
                                    outline-none
                                    focus:border-cyan-400/40
                                    transition
                                "
              />

            </div>

            <div>

              <label className="
                                text-sm
                                text-gray-300
                                mb-2
                                block
                            ">
                Email Address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="you@example.com"
                className="
                                    w-full
                                    rounded-xl
                                    border border-white/10
                                    bg-white/5
                                    px-4
                                    py-3
                                    text-sm
                                    outline-none
                                    focus:border-cyan-400/40
                                    transition
                                "
              />

            </div>

          </div>

          <div className="mt-5">

            <label className="
                            text-sm
                            text-gray-300
                            mb-2
                            block
                        ">
              Additional Details
            </label>

            <textarea
              value={details}
              onChange={(e) =>
                setDetails(e.target.value)
              }
              rows={5}
              placeholder="
Example:
Please delete my old posts and comments from 2024.
"
              className="
                                w-full
                                rounded-xl
                                border border-white/10
                                bg-white/5
                                px-4
                                py-3
                                text-sm
                                outline-none
                                resize-none
                                focus:border-cyan-400/40
                                transition
                            "
            />

          </div>

          {/* Warning */}

          <div className="
                        mt-6
                        rounded-2xl
                        border border-yellow-500/20
                        bg-yellow-500/10
                        p-4
                        flex
                        gap-3
                    ">

            <AlertTriangle
              size={20}
              className="
                                text-yellow-400
                                mt-0.5
                                shrink-0
                            "
            />

            <p className="
                            text-sm
                            text-gray-300
                            leading-relaxed
                        ">
              Permanent deletion requests cannot
              be reversed once processed.
              Please double-check before submitting.
            </p>

          </div>

          {/* CTA */}

          <motion.button
            whileHover={{
              scale: 1.03
            }}
            whileTap={{
              scale: .97
            }}
            onClick={sendRequest}
            className="
                            mt-6
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            w-full
                            sm:w-fit
                            px-6
                            py-3
                            rounded-xl
                            font-semibold
                            text-white
                            bg-gradient-to-r
                            from-cyan-500
                            to-blue-600
                            hover:from-cyan-600
                            hover:to-blue-700
                            transition
                            shadow-lg
                        "
          >

            Send Deletion Request

            <ArrowRight size={18} />

          </motion.button>

        </motion.div>

        {/* Footer */}

        <motion.div
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          transition={{
            delay: .7
          }}
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

          <p className="
                        text-sm
                        sm:text-base
                        text-gray-300
                    ">
            We respect your privacy and your right
            to control your personal data 💙
          </p>

          <div className="mt-4">

            <span className="
                            text-gray-400
                            text-sm
                        ">
              Need help?{" "}
            </span>

            <span
              onClick={() =>
                setShowFeedback(true)
              }
              className="
                                text-cyan-400
                                underline
                                hover:text-cyan-300
                                transition
                                cursor-pointer
                                text-sm
                            "
            >
              Submit feedback
            </span>

          </div>

        </motion.div>

      </div>
    </>
  );
}

export default React.memo(DataDeletion);