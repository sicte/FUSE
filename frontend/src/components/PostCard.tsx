import React, { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { Heart, MessageCircle, Trash, Share2 } from "lucide-react";
import { motion } from "framer-motion";

import { urlPostLike } from "../api/APIs";
import { putRequest } from "../api/APIManager";
import { type Post } from "../models/modelPosts";

import { setMessageBar } from "../redux/sliceMessageBar";
import { useAppDispatch } from "../redux/hookStore";

import ImageViewer from "./ImageViewer";
import Alert from "./Alert";
import ProfilePlaceholder from "../assets/images/ProfilePlaceholder.png";
import MediaPlaceholder from "../assets/images/MediaPlaceholder.png";
import CommentSection from "./CommentSection";

type Props = {
    post: Post;
    isUser: boolean;
    currUserId: number;
    DeletePost: (postId: number) => void;
};

function PostCard({ post, isUser, currUserId, DeletePost }: Props) {
    const dispatch = useAppDispatch();

    const [showImageViewer, setShowImageViewer] = useState(false);
    const [profileLoaded, setProfileLoaded] = useState<boolean>(false);
    const [mediaLoaded, setMediaLoaded] = useState<boolean>(false);
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [isLiked, setIsLiked] = useState<boolean>(post.isLiked);
    const [likes, setLikes] = useState<number>(post.likes);

    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState<number>(post.comments);
    const [isCommented, setIsCommented] = useState<boolean>(post.isCommented);
    const [showAlert, setShowAlert] = useState<boolean>(false);

    const navigate = useNavigate();
    const createdAt = useMemo(() => new Date(post.created_at).toLocaleDateString(), [post.created_at]);
    const hasImage = !!post.media_url;

    const bodyCharacters = 350;
    const isTrimmed = useMemo(() => post.post_body?.length > bodyCharacters, [post.post_body]);
    const trimmedBody = useMemo(() => {
        if (!post.post_body) return "";
        return isTrimmed
            ? post.post_body.slice(0, bodyCharacters).trim().replace(/\s+\S*$/, "") + "..."
            : post.post_body;
    }, [post.post_body, isTrimmed]);

    const handleToggleExpand = useCallback(() => {
        setIsExpanded((prev) => !prev);
    }, []);

    async function Like() {

        const orgLikes = likes;
        const orgIsLiked = isLiked;

        setIsLiked(!orgIsLiked);
        setLikes(orgIsLiked ? orgLikes - 1 : orgLikes + 1);

        const { error } = await putRequest(`${urlPostLike}?id=${post.id}`);
        if (error) {
            setLikes(orgLikes);
            setIsLiked(orgIsLiked);
        }
    }

    function UpdateComment(isUserComment: boolean, amount: number) {
        setIsCommented(isUserComment);
        setComments(Number(comments) + amount);
    }

    function copyLink(post: Post) {
        const postUrl = `${window.location.origin}/post/${post.id}`;
        navigator.clipboard.writeText(postUrl)
            .then(() => {
                dispatch(setMessageBar({ message: "Post link copied to clipboard!", color: "yellow" }));
            })
            .catch((err) => {
                console.log("Error while copyLink:", err);
                dispatch(setMessageBar({ message: "Failed to copy post link!", color: "red" }));
            });
    }

    return (
        <motion.div
            // layout
            className="select-none w-full max-w-full sm:max-w-xl mx-auto my-4 px-4 sm:px-6 py-4 sm:py-6 rounded-2xl bg-black/25 backdrop-blur-sm shadow-lg text-white relative border border-white/10">

            {isUser && currUserId == post.user_id && (
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAlert(true)}
                    className="absolute top-2 right-2 text-red-400 hover:text-red-600 transition-colors duration-200">
                    <Trash className="w-4 h-4 sm:w-[15px] sm:h-[15px]" />
                </motion.button>
            )}

            {!isUser && (
                <div className="flex items-center gap-3 mb-4">
                    <div className="relative w-10 h-10 shrink-0 cursor-pointer" onClick={() => navigate(`/user/${post.user_id}`)}>
                        {!profileLoaded && (
                            <img
                                src={ProfilePlaceholder}
                                alt="placeholder"
                                className="absolute w-full h-full rounded-full object-cover border border-white/20"
                            />
                        )}
                        {post.user_image_url && <img
                            loading="lazy"
                            src={post.user_image_url}
                            alt={post.username}
                            onLoad={() => setProfileLoaded(true)}
                            className={`w-full h-full rounded-full object-cover border border-white/20 transition-opacity duration-500 ${profileLoaded ? "opacity-100" : "opacity-0"}`}
                        />}
                    </div>

                    <div>
                        <div className="font-semibold text-base cursor-pointer" onClick={() => navigate(`/user/${post.user_id}`)}>{post.username}</div>
                        <div className="text-sm text-white/60">{createdAt}</div>
                    </div>
                </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                <h2 className="text-lg sm:text-xl font-semibold leading-snug whitespace-pre-wrap break-words break-all">{post.post_title}</h2>
                {isUser && <div className="text-sm text-white/60">{createdAt}</div>}
            </div>

            {hasImage && (
                <div className="w-full aspect-video mb-4 rounded-lg border border-white/20 overflow-hidden relative bg-white/5">
                    {!mediaLoaded && (
                        <img
                            src={MediaPlaceholder}
                            alt="placeholder"
                            className="w-full h-full object-cover absolute top-0 left-0"
                        />
                    )}
                    <motion.img
                        onClick={() => setShowImageViewer(true)}
                        loading="lazy"
                        src={post.media_url}
                        alt="post"
                        onLoad={() => setMediaLoaded(true)}
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={mediaLoaded ? { scale: 1, opacity: 1 } : {}}
                        transition={{ type: "spring", stiffness: 100, damping: 15 }}
                        className={`w-full h-full object-cover transition-opacity duration-500 ${mediaLoaded ? "opacity-100" : "opacity-0"}`}
                    />
                </div>
            )}

            <div className="relative">
                <div
                    className={`custom-scroll text-white/90 text-sm leading-relaxed break-words whitespace-pre-wrap pr-1 h-28 transition-all duration-300
                    ${isExpanded ? "overflow-y-auto scrollbar-thin scrollbar-thumb-white/30" : "overflow-hidden"}`}>
                    {isExpanded ? post.post_body : trimmedBody}
                </div>

                {isTrimmed && (
                    <button
                        onClick={handleToggleExpand}
                        className="text-cyan-400 text-sm hover:underline mt-1">
                        {isExpanded ? "Show Less" : "More"}
                    </button>
                )}
            </div>

            <div className="flex flex-wrap items-center justify-between text-sm mt-4 pt-4 border-t border-white/10 gap-y-2">
                <div className="flex gap-4">
                    <motion.button className={`flex items-center gap-1 transition-colors duration-200 ${isLiked ? 'text-red-500' : 'hover:text-red-400'}`}
                        onClick={Like}
                        whileTap={{ scale: 1.2 }}
                        whileHover={{ scale: 0.95 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}>
                        <Heart className={`w-4 h-4 transition-all duration-200 ${isLiked ? "fill-red-500" : "fill-transparent"}`} /> <span>{likes}</span>
                    </motion.button>
                    <motion.button className={`flex items-center gap-1 transition-colors duration-200 ${isCommented ? 'text-cyan-500' : 'hover:text-cyan-400'}`}
                        onClick={() => setShowComments(prev => !prev)}
                        whileTap={{ scale: 1.2 }}
                        whileHover={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}>
                        <MessageCircle className={`w-4 h-4 transition-all duration-200 ${isCommented ? "fill-cyan-500" : "fill-transparent"}`} /> <span>{comments}</span>
                    </motion.button>
                    <motion.button className={`flex items-center gap-1 transition-colors duration-200 hover:text-orange-400`}
                        onClick={() => copyLink(post)}
                        whileTap={{ scale: 1.2 }}
                        whileHover={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}>
                        <Share2 className={`w-4 h-4 transition-all duration-200 fill-transparent`} />
                    </motion.button>
                </div>
                <span className="text-white/50 text-xs break-all">{post.category}</span>
            </div>

            {showComments && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}>
                    <CommentSection
                        postId={post.id}
                        onClose={() => setShowComments(false)}
                        UpdateComment={UpdateComment} />
                </motion.div>
            )}

            <Alert
                isOpen={showAlert}
                message="Are you sure you want to delete this post?"
                onClose={() => setShowAlert(false)}
                onConfirm={() => DeletePost(post.id)}
            />

            {showImageViewer && (
                <ImageViewer
                    imageUrl={post.media_url}
                    onClose={() => setShowImageViewer(false)}
                />
            )}

        </motion.div>
    );
}

export default React.memo(PostCard);