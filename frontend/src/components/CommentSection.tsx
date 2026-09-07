import React, { useEffect, useState, useRef } from "react";
import { X, Trash } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { setMessageBar } from "../redux/sliceMessageBar";
import { useAppDispatch, useAppSelector } from "../redux/hookStore";

import { urlComment } from "../api/APIs";
import { getRequest, deleteRequest, postRequest } from "../api/APIManager";
import { type Comment, type CommentData } from "../models/modelComment";

import ColorManager from "../utils/ColorManager";
import Alert from "./Alert";
import GetMessage from "../utils/MessagesManager";

type Props = {
    postId: number;
    onClose: () => void;
    UpdateComment: (isUserComment: boolean, amount: number) => void;
};

const CommentSection = ({ postId, onClose, UpdateComment }: Props) => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.user);
    const scrollRef = useRef<HTMLDivElement>(null);

    const [comments, setComments] = useState<Comment[]>([]);
    const [commentInput, setCommentInput] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [currPage, setCurrPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [deleteCallback, setDeleteCallback] = useState<() => void>(() => () => { });

    function handleScroll() {
        const el = scrollRef.current;
        if (!el || isFetchingMore || currPage >= totalPages) return;

        if (el.scrollHeight - el.scrollTop <= el.clientHeight + 40) {
            fetchComments(currPage + 1);
        }
    };

    const ShowMsg = (message: string, color: string) => {
        dispatch(setMessageBar({ message, color }));
    };

    const fetchComments = async (page = 1) => {
        if (page > totalPages) return;

        page === 1 ? setLoading(true) : setIsFetchingMore(true);
        const { data } = await getRequest<CommentData>(`${urlComment}?id=${postId}&page=${page}`);
        if (data) {
            setComments(prev => page === 1 ? data.comments : [...prev, ...data.comments]);
            setCurrPage(data.currPage);
            setTotalPages(data.totalPages);
        }
        setLoading(false);
        setIsFetchingMore(false);
    };

    const AddComment = async () => {
        const commentInputValue = commentInput.trim();

        if (commentInputValue.length < 1) {
            ShowMsg(GetMessage('commentLess'), ColorManager.msgError);
            return;
        }
        if (commentInputValue.length > 1000) {
            ShowMsg(GetMessage('commentMore'), ColorManager.msgError);
            return;
        }

        const newComment: Comment = {
            id: -Date.now(),
            comment: commentInputValue,
            username: user.username,
            user_image_url: user.image_url,
            isUserComment: true,
            created_at: new Date().toISOString(),
        };

        setComments(prev => [newComment, ...prev]);
        setCommentInput('');
        UpdateComment(true, 1);
        ShowMsg(GetMessage("commentAdded"), ColorManager.msgSuccess);

        const { data, error } = await postRequest<string>(urlComment, {
            postId,
            comment: commentInput,
            created_at: new Date().toISOString()
        });

        if (!data || error) {
            ShowMsg(error, ColorManager.msgError);
            setComments(prev => prev.filter(comment => comment.id !== newComment.id));
        }
    };

    const DeleteComment = async (id: number) => {
        const oldComments = comments;

        setComments(prev => prev.filter(c => c.id !== id));
        ShowMsg(GetMessage("commentDeleted"), ColorManager.msgSuccess);

        const { error } = await deleteRequest<string>(`${urlComment}?id=${id}`);

        if (error) {
            setComments(oldComments);
            ShowMsg(error, ColorManager.msgError);
        }
    };

    useEffect(() => {
        setComments([]);
        setCurrPage(1);
        setTotalPages(1);
        fetchComments(1);
    }, [postId]);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="mt-4 w-full bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 text-white shadow-xl max-h-[60vh] sm:max-h-[60vh] flex flex-col">
                <div className="flex justify-between items-center px-4 py-3 border-b border-white/10 bg-black/50 sticky top-0 z-10">
                    <h2 className="text-base font-semibold tracking-wide">💬 Comments</h2>
                    <button onClick={onClose} className="text-white/60 hover:text-red-400 transition">
                        <X size={20} />
                    </button>
                </div>

                <div
                    className="overflow-y-auto px-4 py-3 space-y-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent flex-1"
                    ref={scrollRef}
                    onScroll={handleScroll}>
                    {loading ? (
                        <p className="text-white/50 text-sm text-center">Loading...</p>
                    ) : comments.length === 0 ? (
                        <p className="text-white/50 text-sm text-center">No comments yet.</p>
                    ) : (
                        <AnimatePresence>
                            {comments.map(comment => (
                                <motion.div
                                    key={comment.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    layout
                                    className="bg-white/5 p-3 rounded-xl border border-white/10 flex flex-col">
                                    <div className="flex justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-sm">{comment.username}</div>
                                            <div className="text-sm mt-1 whitespace-pre-wrap break-words break-all">
                                                {comment.comment}
                                            </div>
                                        </div>
                                        {comment.isUserComment && (
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => {
                                                    setDeleteCallback(() => () => DeleteComment(comment.id));
                                                    setShowAlert(true);
                                                }}
                                                className="text-red-500 hover:text-red-600"
                                            >
                                                <Trash size={16} />
                                            </motion.button>
                                        )}
                                    </div>
                                    <div className="text-white/40 text-xs mt-2 text-right">
                                        {new Date(comment.created_at).toLocaleDateString()}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>

                <motion.div
                    className="px-4 py-3 border-t border-white/10 bg-black/50 sticky bottom-0 z-10"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}>
                    <div className="flex gap-2 items-center">
                        <input
                            type="text"
                            placeholder="Add a comment..."
                            value={commentInput}
                            onChange={(e) => setCommentInput(e.target.value)}
                            className="flex-1 px-3 py-2 text-sm bg-black/30 rounded-lg border border-white/20 text-white placeholder-white/50 outline-none"
                        />
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={AddComment}
                            className="px-4 py-2 bg-cyan-500 text-white text-sm font-semibold rounded-lg hover:bg-cyan-600 transition"
                        >
                            Comment
                        </motion.button>
                    </div>
                </motion.div>

                <Alert
                    isOpen={showAlert}
                    message="Are you sure you want to delete this comment?"
                    onClose={() => setShowAlert(false)}
                    onConfirm={deleteCallback}
                />
            </motion.div>
        </AnimatePresence>
    );
};

export default React.memo(CommentSection);
