import React, { useEffect, useState } from "react";

import { useAppSelector } from "../../redux/hookStore";
import { type Message } from "../../models/modelMessage";

import MessageUserList from "./MessageUserList";
import MessageChatBox from "./MessageChatBox";

const Messages = () => {
    const localUser = useAppSelector(state => state.user);
    const [isMobile, setIsMobile] = useState(false);
    const [selectedMessage, setSelectedMessage] = useState<null | Message>(null);
    const [sentMessage, setSentMessage] = useState<Message>();

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();

        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    if (!localUser) return <div className="text-white p-4">Loading data...</div>;;

    return (
        <>
            <div className="flex h-full w-full gap-3">
                <div className={` h-full ${selectedMessage && isMobile ? "hidden" : "block"} ${selectedMessage && !isMobile ? "w-1/3" : "w-full"}`}>
                    <MessageUserList
                        onMessageClick={(user) => setSelectedMessage(user)}
                        sentMessage={sentMessage}
                        selectedMessage={selectedMessage}
                    />
                </div>
                {selectedMessage && localUser && (
                    <div className={`h-full ${isMobile ? "w-full" : "w-2/3"}`}>
                        <MessageChatBox
                            message={selectedMessage}
                            localUser={localUser}
                            setSentMessage={(msg) => setSentMessage(msg)}
                            onClose={() => setSelectedMessage(null)}
                        />
                    </div>
                )}
            </div>
        </>
    );
};

export default React.memo(Messages);