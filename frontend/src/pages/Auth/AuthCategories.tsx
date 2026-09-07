import React, { useState} from "react";
import { type User } from "../../models/modelUser";
import GetMessage from "../../utils/MessagesManager";
import { motion, AnimatePresence } from "framer-motion";
import CategoriesSection from "../../components/CategoriesSection";
import ColorManager from "../../utils/ColorManager";

type AuthCategoriesProps = {
  ShowMsg: (msg: string, color?: string) => void;
  SetUser: (user: User) => void;
  user: User;
};

function AuthCategories({ ShowMsg, SetUser, user }: AuthCategoriesProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  function ButtonContinue() {
    if (selectedCategories.length < 1) {
      ShowMsg(GetMessage('categorySelect'), ColorManager.msgError);
      return;
    }
    setIsVisible(false);
    setTimeout(() => {
      const updatedUser: User = {
        ...user,
        categories: selectedCategories,
      };
      SetUser(updatedUser);
    }, 500);
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-1 pointer-events-none select-none">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            key="auth-categories"
            initial={{ opacity: 0, scale: 0.8, x: 200 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: -200 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="w-full max-w-[95vw] sm:max-w-4xl h-[95vh] px-4 sm:px-6 pt-4 sm:pt-6 pb-0 rounded-2xl bg-black/25 backdrop-blur-sm pointer-events-auto shadow-lg relative overflow-hidden flex flex-col">

            <CategoriesSection
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              onError={(msg : string) => ShowMsg(msg, ColorManager.msgError)}
            />

            <div className="py-2 px-2 flex justify-end items-center rounded-b-2xl">
              <button
                onClick={ButtonContinue}
                className="text-white text-sm font-semibold py-2 px-4 rounded-lg mt-1 transition bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                Continue
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default React.memo(AuthCategories);