import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { type User } from "../../models/modelUser";

import { setUser } from "../../redux/sliceUser";
import { setLoader } from "../../redux/sliceLoader";
import { setMessageBar } from "../../redux/sliceMessageBar";
import { useAppSelector, useAppDispatch } from "../../redux/hookStore";

import { urlUser } from "../../api/APIs";
import { putRequest } from "../../api/APIManager";

import GetMessage from "../../utils/MessagesManager";
import CategoriesSection from "../../components/CategoriesSection";
import ColorManager from "../../utils/ColorManager";


function CustomizeFeed() {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    useEffect(() => {
        if (user.isLoaded) {
            setSelectedCategories(user.categories);
        }
    }, [user.isLoaded])

    function ShowMsg(message: string, color: string) {
        dispatch(setMessageBar({ message, color }))
    }

    async function ButtonSave() {
        if (selectedCategories.length < 1) {
            ShowMsg(GetMessage('categorySelect'), ColorManager.msgError);
            return;
        }

        dispatch(setLoader({ isLoading: true }));

        const { data, error } = await putRequest<User>(urlUser, { categories: selectedCategories });
        if (data) {
            dispatch(setUser(data));
            ShowMsg(GetMessage('categoriesupdated'), ColorManager.msgSuccess);
        }
        else {
            ShowMsg(error, ColorManager.msgError);
        }

        dispatch(setLoader({ isLoading: false }));
    }

    return (
        <div className="flex w-full h-full items-center justify-center z-1 pointer-events-none select-none">
            <AnimatePresence>
                <motion.div
                    key="auth-categories"
                    initial={{ opacity: 0, scale: 0.8, x: 200 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8, x: -200 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="w-full max-w-[95vw] sm:max-w-4xl max-h-[85vh] sm:max-h-[100vh] px-4 sm:px-6 py-0 sm:pt-6 rounded-2xl bg-black/25 backdrop-blur-sm pointer-events-auto shadow-lg relative overflow-hidden flex flex-col">
                        
                    <CategoriesSection
                        selectedCategories={selectedCategories}
                        setSelectedCategories={setSelectedCategories}
                        onError={(msg: string) => ShowMsg(msg, ColorManager.msgError)}
                    />

                    <div className="py-2 px-2 flex gap-2 justify-end items-center rounded-b-2xl">
                        <button
                            className="text-white text-sm sm:text-base font-semibold py-1.5 sm:py-2 px-5 sm:px-6 rounded-lg mt-1 transition bg-cyan-500 hover:bg-cyan-700"
                            onClick={() => setSelectedCategories([])}>
                            Clear All
                        </button>

                        <button
                            onClick={ButtonSave}
                            className="text-white text-sm sm:text-base font-semibold py-1.5 sm:py-2 px-5 sm:px-6 rounded-lg mt-1 transition bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                            Save
                        </button>
                    </div>

                </motion.div>
            </AnimatePresence>
        </div>
    );
}

export default React.memo(CustomizeFeed);