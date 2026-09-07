import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Send, Paperclip, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import socket from "./socket";

import { clearMessage } from "../../redux/sliceMessages";
import { setLoader } from "../../redux/sliceLoader";
import { setMessageBar } from "../../redux/sliceMessageBar";
import { useAppSelector, useAppDispatch } from "../../redux/hookStore";

import { urlMessages } from "../../api/APIs";
import { getRequest } from "../../api/APIManager";
import { type User } from "../../models/modelUser";
import { type Message, type MessageData } from "../../models/modelMessage";

import ImageViewer from "../../components/ImageViewer";
import GetMessage from "../../utils/MessagesManager";
import MediaPlaceholder from "../../assets/images/MediaPlaceholder.png";
import ProfilePlaceholder from "../../assets/images/ProfilePlaceholder.png";
import ColorManager from "../../utils/ColorManager";

interface MessageChatBoxProps {
    message: Message;
    localUser: User;
    setSentMessage: (sentMessage: Message) => void;
    onClose: () => void;
}

const MAX_CHARS = 300;

const MessageChatBox = ({ onClose, message, localUser, setSentMessage }: MessageChatBoxProps) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const receivedMessage = useAppSelector(state => state.messages)

    const [profileLoaded, setProfileLoaded] = useState<boolean>(false);
    const [messageLoading, setMessageLoading] = useState<boolean>(false);
    const [mediaLoadedMap, setMediaLoadedMap] = useState<Record<string, boolean>>({});
    const [expanded, setExpanded] = useState<Set<string>>(new Set());
    const [currPage, setCurrPage] = useState<number>(1);
    const [msgInput, setMsgInput] = useState<string>('');
    const [selectedImageViewer, setSelectedImageViewer] = useState<string>('');
    const [mediaPreview, setMediaPreview] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [messages, setMessages] = useState<Message[]>([]);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);

    const sender_id = localUser.id;
    const receiver_id = message.sender_id;
    const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
    const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET;


    function ShowMsg(message: string, color: string) {
        dispatch(setMessageBar({ message, color }));
    }

    function ShowLoader(isLoading: boolean) {
        dispatch(setLoader({ isLoading }));
    }

    function FormatTimestamp(dateStr: string) {
        const date = new Date(dateStr);
        return date.toLocaleString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            day: "2-digit",
            month: "short",
        });
    }

    async function Fetch(page: number) {
        if (page > totalPages || messageLoading) return;

        setMessageLoading(true);
        const { data } = await getRequest<MessageData>(`${urlMessages}?userId=${receiver_id}&page=${page}`);
        setTimeout(() => { setMessageLoading(false); }, 100);
        if (!data) return;

        setMessages(prev => {
            const existingIds = new Set(prev.map(msg => msg.id));
            const newMessages = data.messages
                .filter(msg => !existingIds.has(msg.id));
            return [...prev, ...newMessages];
        });

        setTotalPages(data.totalPages);
        setCurrPage(data.currPage);
    }

    function ToggleExpand(index: string) {
        const newSet = new Set(expanded);
        newSet.has(index) ? newSet.delete(index) : newSet.add(index);
        setExpanded(newSet);
    };

    function MediaLoad(userId: string) {
        setMediaLoadedMap((prev) => ({ ...prev, [userId]: true }));
    };

    async function SendMessage() {
        const message = msgInput.trim();
        if (!message && !selectedFile) return;

        if (message.length > 4000) return ShowMsg(GetMessage('messageLong'), ColorManager.msgError);
        
        const time = Date.now().toString(36);
        const random = crypto.getRandomValues(new Uint32Array(1))[0].toString(36);
        const msgId = `${time}${random}`;

        let mediaURL = '';
        if (selectedFile) {
            ShowLoader(true);
            mediaURL = await UploadMedia(selectedFile);
            ShowLoader(false);
        }

        const msg: Message = {
            id: msgId,
            sender_id,
            receiver_id,
            sender_username: localUser.username,
            sender_image_url: localUser.image_url,
            message,
            media_url: mediaURL,
            created_at: new Date().toISOString(),
        };

        setSentMessage(msg);
        socket.emit('send_message', msg);

        setMessages(pre => {
            if (pre.some(m => m.id === msg.id)) return pre;
            return [msg, ...pre];
        });

        setMsgInput('');
        setSelectedFile(null);
        setMediaPreview(null);
    };

    function ChangeInputMsg(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            SendMessage();
        }
    }

    const ValidateFile = (file: File) => {
        const validTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!validTypes.includes(file.type)) return ShowMsg("Only JPG, PNG or WEBP images are allowed", ColorManager.msgError), false;
        if (file.size > 10 * 1024 * 1024) return ShowMsg(GetMessage('postImageSize'), ColorManager.msgError), false;
        return true;
    };

    async function UploadMedia(file: File) {
        if (!ValidateFile(file)) return null;

        const formData = new FormData();
        formData.append("folder", "fuse");
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);

        try {
            const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: "POST", body: formData });
            const data = await res.json();
            return data?.secure_url ?? null;
        } catch (err) {
            return null;
        }
    };

    function SelectMedia(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setMediaPreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    useEffect(() => {
        if (!receivedMessage || receivedMessage.sender_id != receiver_id) return;
        let msg = receivedMessage;
        setMessages(pre => {
            // if (pre.some(m => m.id === msg.id)) msg.id = receivedMessage.id + 1;
            if (pre.some(m => m.id === msg.id)) return pre;
            return [msg, ...pre];
        });

        setTimeout(() => { dispatch(clearMessage()); }, 2000);
    }, [receivedMessage]);

    useEffect(() => {
        setMessages([]);
        Fetch(0);
    }, [message]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = async () => {
            const scroll = -container.scrollTop;
            const height = container.scrollHeight - container.clientHeight - 400;
            if (scroll >= height) await Fetch(currPage + 1);
        };

        container.addEventListener("scroll", handleScroll);
        return () => container.removeEventListener("scroll", handleScroll);
    }, [currPage, totalPages, messages]);

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key="chatbox"
                initial={{ opacity: 0, scale: 0.95, x: 50 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95, x: 100 }}
                transition={{ type: "spring", stiffness: 100, damping: 18 }}
                className="w-full h-full flex flex-col bg-black/25 backdrop-blur-md rounded-l-xl pb-7 bg-gradient-to-br from-[#0b0b10] via-[#1a0f1f] to-[#0c1118] shadow-[0_0_6px_rgba(88,28,135,0.2)]">

                <div className="flex items-center justify-between px-4 py-3 bg-black/30 border-b border-white/10 shrink-0">
                    <motion.button
                        onClick={() => navigate(`/user/${receiver_id}`)}
                        className="flex items-center gap-3"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}>
                        <div className="relative w-9 h-9 shrink-0">
                            {!profileLoaded && (
                                <img
                                    alt="User"
                                    className="absolute w-full h-full rounded-full object-cover border border-white/20"
                                    src={ProfilePlaceholder}
                                />
                            )}
                            {message.sender_image_url && <img
                                loading="lazy"
                                src={message.sender_image_url}
                                alt={message.sender_username}
                                onLoad={() => setProfileLoaded(true)}
                                className={`w-full h-full rounded-full object-cover border border-white/20 transition-opacity duration-500 ${profileLoaded ? "opacity-100" : "opacity-0"}`}
                            />}
                        </div>

                        <div className="text-sm sm:text-base font-semibold text-white">
                            {message.sender_username}
                        </div>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onClose}
                        className="p-1 rounded hover:bg-white/10 transition">
                        <X className="w-5 h-5 text-white" />
                    </motion.button>
                </div>

                <div
                    ref={containerRef}
                    className="flex-1 overflow-y-auto px-4 py-3 flex flex-col-reverse space-y-reverse space-y-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">

                    <AnimatePresence initial={false}>
                        {messages.map((message) => {
                            const isLong = message.message.length > MAX_CHARS;
                            const isExpanded = expanded.has(message.id);
                            const displayText = isExpanded || !isLong ? message.message : message.message.slice(0, MAX_CHARS) + "...";

                            return (
                                <motion.div
                                    key={message.id}
                                    layout="position"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ type: "spring", stiffness: 100, damping: 18 }}
                                    className={`rounded-lg px-3 py-2 max-w-xs break-words relative ${message.sender_id == localUser.id
                                        ? "bg-cyan-500 text-white self-end ml-auto"
                                        : "bg-white/10 text-white"}`}>
                                    <div className="text-sm whitespace-pre-wrap break-words">
                                        {displayText}
                                    </div>

                                    {message.media_url && <div
                                        className="w-full aspect-video my-2 rounded-lg border border-white/20 overflow-hidden relative bg-white/5">
                                        {!mediaLoadedMap[message.id] && (
                                            <img
                                                src={MediaPlaceholder}
                                                alt="placeholder"
                                                className="w-full h-full object-cover absolute top-0 left-0"
                                            />
                                        )}
                                        <motion.img
                                            loading="lazy"
                                            onClick={() => { setSelectedImageViewer(message.media_url) }}
                                            src={message.media_url}
                                            alt="post"
                                            onLoad={() => MediaLoad(message.id)}
                                            initial={{ scale: 0.95, opacity: 0 }}
                                            animate={mediaLoadedMap[message.id] ? { scale: 1, opacity: 1 } : {}}
                                            transition={{ type: "spring", stiffness: 100, damping: 15 }}
                                            className={`w-full h-full object-cover transition-opacity duration-500 ${mediaLoadedMap[message.id] ? "opacity-100" : "opacity-0"}`}
                                        />
                                    </div>}

                                    {selectedImageViewer && (
                                        <ImageViewer
                                            imageUrl={selectedImageViewer}
                                            onClose={() => setSelectedImageViewer('')}
                                        />
                                    )}

                                    {isLong && (
                                        <button
                                            onClick={() => ToggleExpand(message.id)}
                                            className="mt-1 underline text-xs text-white/70 hover:text-white">
                                            {isExpanded ? "Show less" : "More"}
                                        </button>
                                    )}

                                    <div
                                        className={`mt-1 text-[10px] ${message.sender_id == localUser.id ? "text-white text-right" : "text-white/60 text-left"}`}>
                                        {FormatTimestamp(message.created_at)}
                                    </div>

                                </motion.div>
                            );
                        })}
                    </AnimatePresence>

                    {messageLoading && (
                        <div className="w-full flex justify-center py-2">
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-xs text-white/70">
                                Loading messages...
                            </motion.div>
                        </div>
                    )}

                </div>

                <div className={`px-4 py-3 bg-black/30 border-t shrink-0 rounded-b-xl border-b border-white/10 
                    ${mediaPreview ? 'flex flex-col gap-2' : 'flex items-center gap-2'}`}>

                    {mediaPreview ? (
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
                            <button
                                onClick={() => {
                                    setSelectedFile(null);
                                    setMediaPreview(null);
                                }}
                                className="absolute top-2 right-2 bg-black/40 hover:bg-black/60 text-white p-1 rounded-full transition">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ) : null}

                    <div className="flex items-center gap-2 w-full">
                        {!mediaPreview && (
                            <>
                                <label htmlFor="media-input" className="cursor-pointer hover:scale-105 transition">
                                    <Paperclip className="text-white" />
                                </label>
                                <input
                                    id="media-input"
                                    type="file"
                                    accept="image/jpeg, image/png, image/webp"
                                    className="hidden"
                                    onChange={SelectMedia}
                                />
                            </>
                        )}

                        <textarea
                            rows={1}
                            placeholder="Type a message"
                            value={msgInput}
                            onChange={(e) => setMsgInput(e.target.value)}
                            onKeyDown={(e) => ChangeInputMsg(e)}
                            className="flex-1 resize-none bg-white/10 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none"
                        />
                        <motion.button
                            onClick={() => SendMessage()}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 rounded hover:bg-white/10 transition">
                            <Send className="w-5 h-5 text-white" />
                        </motion.button>
                    </div>
                </div>

            </motion.div>
        </AnimatePresence>
    );
};

export default React.memo(MessageChatBox);