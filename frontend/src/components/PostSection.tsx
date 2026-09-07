import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";

import { setMessageBar } from "../redux/sliceMessageBar";
import { useAppDispatch } from "../redux/hookStore";

import { urlPost } from "../api/APIs";
import { getRequest, deleteRequest } from "../api/APIManager";
import { type PostData, type Post, getInitialPosts } from "../models/modelPosts";

import ColorManager from "../utils/ColorManager";
import PostCard from "./PostCard";
import SkeletonPost from "./SkeletonPost";

type PostSectionProps = {
    baseUrl: string;
    isUserPost: boolean;
    currUserId: number;
};

const PostSection: React.FC<PostSectionProps> = ({ baseUrl, isUserPost, currUserId }) => {
    const dispatch = useAppDispatch();

    const [page, setPage] = useState(1);
    const [postData, setPostData] = useState<PostData>(getInitialPosts());
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);

    const observer = useRef<IntersectionObserver | null>(null);
    const isInitialMount = useRef(true);

    const postVariants: Variants = useMemo(() => ({
        hidden: { opacity: 0, y: 60, scale: 0.95 },
        visible: (i = 0) => ({
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                delay: i * 0.05,
                type: "spring",
                stiffness: 120,
                damping: 20,
            },
        }),
        exit: {
            opacity: 0,
            y: -20,
            scale: 0.9,
            transition: { duration: 0.3 },
        },
    }), []);

    const fetchPosts = useCallback(async (pg: number) => {
        const url = baseUrl.includes("?") ? `${baseUrl}&page=${pg}` : `${baseUrl}?page=${pg}`;
        const { data, error } = await getRequest<PostData>(url);
        if (error || !data) return null;
        return data;
    }, [baseUrl]);

    const lastPostRef = useCallback((node: HTMLDivElement | null) => {
        if (loading || !hasMore) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setPage((prev) => prev + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    const DeletePost = async (id: number) => {
        let deletedPost: Post | undefined;

        setPostData(pre => {
            deletedPost = pre.posts.find(post => post.id === id);
            return {
                ...pre,
                posts: pre.posts.filter(post => post.id !== id)
            }
        })

        const { error } = await deleteRequest<string>(`${urlPost}?id=${id}`);

        if (error) {
            dispatch(setMessageBar({ message: error, color: ColorManager.msgError }));

            setPostData(pre => ({
                ...pre,
                posts: [deletedPost!, ...pre.posts]
            }));
        }
    };

    useEffect(() => {
        setPage(1);
        setPostData(getInitialPosts());
        setHasMore(true);
        isInitialMount.current = true;
    }, [baseUrl]);

    useEffect(() => {
        (async () => {
            setLoading(true);
            const data = await fetchPosts(page);
            if (data) {
                setPostData((prev) => ({
                    ...data,
                    posts: page === 1 ? data.posts : [...prev.posts, ...data.posts],
                }));

                setHasMore(data.posts.length > 0);
            }
            setLoading(false);
        })();
    }, [page, fetchPosts]);

    return (
        <>
            <AnimatePresence>
                {postData.posts.map((post, index) => {
                    const isLast = index === postData.posts.length - 1;
                    return (
                        <motion.div
                            key={post.id}
                            ref={isLast ? lastPostRef : null}
                            custom={index}
                            variants={postVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit">
                            <PostCard
                                post={post}
                                isUser={isUserPost}
                                currUserId={currUserId}
                                DeletePost={DeletePost} />
                        </motion.div>
                    );
                })}
            </AnimatePresence>

            {loading && (
                <div className="mt-4 space-y-3">
                    {[...Array(3)].map((_, i) => <SkeletonPost key={i} />)}
                </div>
            )}

            {!loading && postData.posts.length === 0 && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-white/40 py-4 col-span-full select-none">
                    💤 No posts to show
                </motion.p>
            )}

            {/* {!loading && !hasMore && (
                <p className="text-center text-sm text-white/40 py-4">
                    🎉 You've reached the end!
                </p>
            )} */}
        </>
    );
};

export default React.memo(PostSection);