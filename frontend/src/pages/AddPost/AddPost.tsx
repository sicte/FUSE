import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Trash2 } from "lucide-react";

import ColorManager from "../../utils/ColorManager";
import GetMessage from "../../utils/MessagesManager";
import CategoriesSection from "../../components/CategoriesSection";

import { setMessageBar } from "../../redux/sliceMessageBar";
import { setLoader } from "../../redux/sliceLoader";
import { useAppDispatch } from "../../redux/hookStore";

import { urlPost } from "../../api/APIs";
import { postRequest } from "../../api/APIManager";

function AddPost() {
    const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
    const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET;
    const dispatch = useAppDispatch();

    const [fieldValues, setFieldValues] = useState({ postTitle: '', postBody: '', mediaURL: '' });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [mediaPreview, setMediaPreview] = useState<string | null>(null);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const inputClass = "w-full p-3 text-sm sm:text-base rounded-md bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400";

    const ShowMsg = (msg: string, color: string) => dispatch(setMessageBar({ message: msg, color }));
    const ShowLoader = (val: boolean) => dispatch(setLoader({ isLoading: val }));

    const ValidateData = () => {
        const { postTitle, postBody } = fieldValues;
        if (!postTitle) return ShowMsg(GetMessage('postTitleMust'), ColorManager.msgError), false;
        if (postTitle.length < 5) return ShowMsg(GetMessage('postTitleLess'), ColorManager.msgError), false;
        if (postTitle.length > 250) return ShowMsg(GetMessage('postTitleMore'), ColorManager.msgError), false;
        if (selectedCategories.length < 1) return ShowMsg(GetMessage('categorySelect'), ColorManager.msgError), false;

        if (postBody) {
            if (postBody.length < 20) return ShowMsg(GetMessage('postBodyLess'), ColorManager.msgError), false;
            if (postBody.length > 10000) return ShowMsg(GetMessage('postBodyMore'), ColorManager.msgError), false;
        }

        return true;
    };

    const ValidateFile = (file: File) => {
        const validTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!validTypes.includes(file.type)) return ShowMsg("Only JPG, PNG or WEBP images are allowed", ColorManager.msgError), false;
        if (file.size > 10 * 1024 * 1024) return ShowMsg(GetMessage('postImageSize'), ColorManager.msgError), false;
        return true;
    };

    // const UploadMedia = async (file: File) => {
    //     if (!ValidateFile(file)) return null;

    //     const formData = new FormData();
    //     formData.append("folder", "fuse");
    //     formData.append("file", file);
    //     formData.append("upload_preset", UPLOAD_PRESET);

    //     try {
    //         // const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: "POST", body: formData });
    //         const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: "POST", body: formData });
    //         const data = await res.json();
    //         return data?.secure_url ?? null;
    //     } catch (err) {
    //         console.log("Uploading fail:", err);
    //         return null;
    //     }
    // };

    const UploadMedia = async (file: File) => {
    if (!ValidateFile(file)) return null;

    // Create FormData container to send to our backend server.
    const formData = new FormData();
    formData.append("image", file); // Include with key name "image" recognized by backend multer.

    try {
        // Call local backend server upload endpoint instead of external Cloudinary.
        const res = await fetch(`http://localhost:1000/upload`, { 
            method: "POST", 
            body: formData 
        });
        
        if (!res.ok) throw new Error("Server upload failed");

        const data = await res.json();
        // Return the local image URL returned by the backend.
        return data?.url ?? null; 
    } catch (err) {
        console.log("Uploading fail:", err);
        return null;
    }
};


    

    const SelectMedia = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setMediaPreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    function ClearAllFields() {
        setFieldValues({ postTitle: '', postBody: '', mediaURL: '' });
        setMediaPreview(null);
        setSelectedFile(null);
        setSelectedCategories([]);
    };

    const ButtonAddPost = async () => {
        ShowLoader(true);
        if (!ValidateData()) return ShowLoader(false);

        let uploadedMediaURL = '';
        if (selectedFile) {
            const url = await UploadMedia(selectedFile);
            if (!url) return ShowMsg(GetMessage('mediaUploadFail'), ColorManager.msgError), ShowLoader(false);
            uploadedMediaURL = url;
        }

        const body = {
            postTitle: fieldValues.postTitle,
            category: selectedCategories[0],
            ...(fieldValues.postBody?.trim() && { postBody: fieldValues.postBody }),
            ...(uploadedMediaURL?.trim() && { mediaURL: uploadedMediaURL }),
            created_at: new Date().toISOString()
        };

        const { data, error } = await postRequest<string>(urlPost, body);
        if (data) ClearAllFields();
        ShowMsg(data || error, data ? ColorManager.msgSuccess : ColorManager.msgError);
        ShowLoader(false);
    };

    return (
        <div className="flex w-full h-full items-center justify-center z-1 pointer-events-none select-none px-2 sm:px-0">
            <AnimatePresence>
                <motion.div
                    key="add-post"
                    initial={{ opacity: 0, y: -100, scale: 0.7 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -100, scale: 0.7 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="w-[90%] sm:w-[700px] max-h-[85vh] sm:max-h-[100vh] rounded-2xl bg-black/30 backdrop-blur-md pointer-events-auto shadow-xl relative overflow-hidden flex flex-col">

                    <div className="overflow-y-auto p-4 sm:p-6 space-y-4 custom-scroll">

                        <div>
                            <label htmlFor="title" className="block text-white text-base sm:text-lg font-semibold mb-2">Title</label>
                            <input
                                type="text"
                                id="title"
                                placeholder="Bad Post"
                                value={fieldValues.postTitle}
                                className={inputClass}
                                onChange={(e) => setFieldValues({ ...fieldValues, postTitle: e.target.value })}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="block text-white text-base sm:text-lg font-semibold">
                                {mediaPreview ? "Uploaded Media" : "Upload Media"}
                            </label>

                            {!mediaPreview ? (
                                <>
                                    <label htmlFor="media-upload"
                                        className="cursor-pointer w-full bg-white/10 hover:bg-white/20 text-white text-sm text-center py-3 rounded-md border border-white/20 transition-all duration-200">
                                        Click to upload media
                                    </label>
                                    <input type="file" id="media-upload" accept="image/*" onChange={SelectMedia} className="hidden" />
                                </>
                            ) : (
                                <div className="relative w-full">
                                    <motion.img
                                        key={mediaPreview}
                                        src={mediaPreview}
                                        alt="Preview"
                                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3 }}
                                        className="w-full max-h-60 object-contain rounded-md border border-white/20"
                                    />
                                    <button onClick={() => setMediaPreview(null)}
                                        className="absolute top-2 right-2 bg-black/40 hover:bg-black/60 text-white p-1 rounded-full transition">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            )}
                        </div>

                        <div>
                            <label htmlFor="body" className="block text-white text-base sm:text-lg font-semibold mb-2">Description</label>
                            <textarea
                                id="body"
                                rows={5}
                                placeholder="Don't deserve Description"
                                value={fieldValues.postBody}
                                className={`${inputClass} max-h-48 overflow-y-auto resize-none custom-scroll`}
                                onChange={(e) => setFieldValues({ ...fieldValues, postBody: e.target.value })}
                            />
                        </div>

                        <div className="w-full h-[40vh]">

                            {/* <hr className="border-t border-dashed border-white/30 my-2" /> */}
                            {/* <div className="h-0.5 w-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 opacity-60 rounded-full" /> */}

                            <div className="w-full max-w-[100vw] sm:max-w-4xl h-[40vh] relative overflow-hidden flex flex-col">
                                <label htmlFor="Category" className="block text-white text-base sm:text-lg font-semibold mb-2">Category</label>
                                <CategoriesSection
                                    selectedCategories={selectedCategories}
                                    setSelectedCategories={setSelectedCategories}
                                    onError={(msg) => ShowMsg(msg, ColorManager.msgError)}
                                    singleSelect />
                            </div>

                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 p-4 border-t border-white/10 bg-black/20">
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            whileHover={{ scale: 1.02 }}
                            className="w-full sm:w-1/2 py-1.5 sm:py-2 text-xs sm:text-sm rounded bg-cyan-500 hover:bg-cyan-700 text-white font-medium border border-white/20 transition"
                            onClick={ClearAllFields}>
                            Clear All
                        </motion.button>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            whileHover={{ scale: 1.02 }}
                            className="w-full sm:w-1/2 py-1.5 sm:py-2 text-xs sm:text-sm rounded bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-medium transition"
                            onClick={ButtonAddPost}>
                            Add Post
                        </motion.button>
                    </div>

                </motion.div>
            </AnimatePresence>
        </div>
    );
}

export default React.memo(AddPost);