import React, { useEffect, useState, useRef, useCallback } from "react";
import { Search as SearchIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { setMessageBar } from "../../redux/sliceMessageBar";
import { clearMessage } from "../../redux/sliceMessages";
import { useAppDispatch, useAppSelector } from "../../redux/hookStore";

import { urlUserSearch, urlMessageUserSearch } from "../../api/APIs";
import { getRequest } from "../../api/APIManager";
import { type Message, type MessageData } from "../../models/modelMessage";

import GetMessage from "../../utils/MessagesManager";
import ProfilePlaceholder from "../../assets/images/ProfilePlaceholder.png";
import ColorManager from "../../utils/ColorManager";

const pageSize = 10;

interface MessageUserListProps {
    sentMessage?: Message;
    selectedMessage: null | Message;
    onMessageClick: (message: Message) => void;
}


function MessageUserList({ onMessageClick, sentMessage, selectedMessage }: MessageUserListProps) {

    const dispatch = useAppDispatch();

    const receivedMessage = useAppSelector(state => state.messages);
    const localUser = useAppSelector(state => state.user);

    const [unreadSenders, setUnreadSenders] = useState<Set<number>>(new Set());
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [cachedUsers, setCachedUsers] = useState<Message[]>([]);
    const [searchUsers, setSearchUsers] = useState<Message[]>([]);
    const [currPage, setCurrPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [isSearchMode, setIsSearchMode] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [profileLoadedMap, setProfileLoadedMap] = useState<Record<string, boolean>>({});
    const listRef = useRef<HTMLDivElement | null>(null);
    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const usersToRender = isSearchMode ? searchUsers : cachedUsers;

    const FetchUsers = useCallback(async (page: number) => {
        setLoading(true);
        const url = isSearchMode
            ? `${urlUserSearch}?term=${encodeURIComponent(searchTerm)}&page=${page}&size=${pageSize}`
            : `${urlMessageUserSearch}?page=${page}&size=${pageSize}`;
        const { data } = await getRequest<MessageData>(url);

        if (!data) return;

        if (isSearchMode) {
            setSearchUsers((prev) => {
                const existingIds = new Set(prev.map((u) => u.sender_id));
                const newUsers = data.messages.filter((u) => !existingIds.has(u.sender_id));
                return [...prev, ...newUsers];
            });
        } else {
            setCachedUsers((prev) => {
                const existingIds = new Set(prev.map((u) => u.sender_id));
                const newUsers = data.messages.filter((u) => !existingIds.has(u.sender_id));
                return [...prev, ...newUsers];
            });
        }

        setCurrPage(data.currPage);
        setTotalPages(data.totalPages);
        setLoading(false);
    }, [isSearchMode, searchTerm]);

    function ImageLoad(userId: number) {
        setProfileLoadedMap((prev) => ({ ...prev, [userId]: true }));
    };

    function UserClick(message: Message) {
        if (message.sender_id == localUser.id) {
            dispatch(setMessageBar({ message: GetMessage('selfMessage'), color: ColorManager.msgError }));
            return;
        }

        if (isSearchMode) {
            setCachedUsers((prev) => {
                const exists = prev.some((u) => u.sender_id === message.sender_id);
                return exists ? prev : [message, ...prev];
            });
        }

        if (unreadSenders.has(message.sender_id)) dispatch(clearMessage());

        setUnreadSenders(prev => {
            const newSet = new Set(prev);
            newSet.delete(message.sender_id);
            return newSet;
        });

        onMessageClick(message);
    };

    function Scroll() {
        const el = listRef.current;
        if (!el || loading) return;
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 50 && currPage < totalPages) {
            FetchUsers(currPage);
        }
    };

    useEffect(() => {
        if (!receivedMessage || !receivedMessage.sender_id) return;

        setCachedUsers((prevUsers) => {
            const existingIndex = prevUsers.findIndex(user => user.sender_id === receivedMessage.sender_id);

            if (existingIndex !== -1) {
                const updatedUser = {
                    ...prevUsers[existingIndex],
                    message: receivedMessage.message,
                    created_at: receivedMessage.created_at,
                };
                const newUsers = [...prevUsers];
                newUsers.splice(existingIndex, 1);
                return [updatedUser, ...newUsers];
            }

            return [receivedMessage, ...prevUsers];
        });

        if (selectedMessage?.sender_id !== receivedMessage.sender_id) setUnreadSenders(prev => new Set(prev.add(receivedMessage.sender_id)));
    }, [receivedMessage]);

    useEffect(() => {
        if (!sentMessage || !sentMessage.receiver_id) return;

        setCachedUsers((prevUsers) => {
            const existingIndex = prevUsers.findIndex(user => user.sender_id === sentMessage.receiver_id);

            if (existingIndex !== -1) {
                const updatedUser = {
                    ...prevUsers[existingIndex],
                    message: sentMessage.message,
                    created_at: sentMessage.created_at,
                };
                const newUsers = [...prevUsers];
                newUsers.splice(existingIndex, 1);
                return [updatedUser, ...newUsers];
            }

            return [sentMessage, ...prevUsers];
        });

    }, [sentMessage]);

    useEffect(() => {
        FetchUsers(0);
    }, [isSearchMode, FetchUsers]);

    useEffect(() => {
        if (searchTerm.trim()) {
            setIsSearchMode(true);
            setSearchUsers([]);
            setCurrPage(0);
            setTotalPages(1);
            if (debounceTimer.current) clearTimeout(debounceTimer.current);
            debounceTimer.current = setTimeout(() => { FetchUsers(0); }, 500);
        } else {
            setIsSearchMode(false);
            setSearchUsers([]);
            setCurrPage(0);
            setTotalPages(1);
        }
    }, [searchTerm]);

    useEffect(() => {
        const el = listRef.current;
        if (el) el.addEventListener("scroll", Scroll);
        return () => el?.removeEventListener("scroll", Scroll);
    }, [currPage, totalPages, loading]);

    return (
        <div className={`w-full h-full flex flex-col pb-7`}>
            <div className="sm:px-4 sm:py-3 px-1 py-1 border-b border-white/10 bg-black/30">
                <div className="relative">
                    <SearchIcon className="absolute left-3 top-2.5 w-5 h-5 text-white/50" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 bg-white/10 text-white placeholder-white/50 rounded-lg focus:outline-none"
                    />
                </div>
            </div>

            <div
                key={isSearchMode ? "search" : "cached"}
                ref={listRef}
                className="flex-1 overflow-y-auto px-2 py-3 space-y-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent bg-black/20 border-t border-white/10 rounded-b-lg">
                <AnimatePresence initial={false}>
                    {usersToRender.length === 0 && !loading ? (
                        <motion.div
                            className="text-white/60 text-center mt-10"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}>
                            No users found.
                        </motion.div>
                    ) : (
                        usersToRender.map((message) => (
                            <motion.div
                                key={message.sender_id}
                                // layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                whileHover={{ scale: 1, backgroundColor: "rgba(255,255,255,0.05)" }}
                                whileTap={{ scale: 0.97 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer select-none bg-white/10 backdrop-blur-md shadow-xl"
                                onClick={() => UserClick(message)}>

                                <div className="relative w-9 h-9 shrink-0">
                                    {!profileLoadedMap[message.sender_id] && (
                                        <img
                                            src={ProfilePlaceholder}
                                            alt="placeholder"
                                            className="absolute w-full h-full rounded-full object-cover border border-white/20"
                                        />
                                    )}
                                    {message.sender_image_url && (
                                        <img
                                            loading="lazy"
                                            src={message.sender_image_url}
                                            alt={message.sender_username}
                                            onLoad={() => ImageLoad(message.sender_id)}
                                            className={`w-full h-full rounded-full object-cover border border-white/20 transition-opacity duration-500 ${profileLoadedMap[message.sender_id] ? "opacity-100" : "opacity-0"}`}
                                        />
                                    )}

                                    {unreadSenders.has(message.sender_id) &&
                                        <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-orange-400 rounded-full border-1 border-black animate-pulse"></span>}

                                </div>

                                <div className="flex flex-col flex-1 min-w-0">
                                    <div className="flex justify-between items-center">
                                        <span className="text-white font-medium truncate">
                                            {message.sender_username}
                                        </span>
                                        {message.created_at && <span className="text-xs text-white/50 whitespace-nowrap">
                                            {new Date(message.created_at).toLocaleDateString()}
                                        </span>}
                                    </div>
                                    <span className="text-sm text-white/60 truncate">
                                        {message.message}
                                    </span>
                                </div>

                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
                {loading && <div className="text-white/50 text-sm text-center py-4">Loading...</div>}
            </div>

        </div>
    );
}

export default React.memo(MessageUserList);