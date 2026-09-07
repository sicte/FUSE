import { useEffect } from "react";
import socket from "./socket";

import { routeMessages } from "../../utils/Routes";

import { setMessage } from "../../redux/sliceMessages";
import { setMessageBar } from "../../redux/sliceMessageBar";
import { useAppDispatch, useAppSelector } from "../../redux/hookStore";

import { type Message } from "../../models/modelMessage";

import GetMessage from "../../utils/MessagesManager";
import ColorManager from "../../utils/ColorManager";

function SocketConnection() {
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.user);

    function SetMessage(username: string) {
        const currentPath = window.location.pathname;
        if (currentPath.startsWith(routeMessages)) return;

        const message = `${GetMessage('messageReceived')} ${username}`;
        dispatch(setMessageBar({ message, color: ColorManager.msgSuccess }))
    }

    function ReceiveMessage(message: Message) {
        if (!message) return;
        dispatch(setMessage(message))
        SetMessage(message.sender_username);
    };

    useEffect(() => {
        if (!user) return;

        const sendHandshake = () => {
            socket.emit('handshake', user.id);
        };

        if (socket.connected) {
            sendHandshake();
        }

        socket.on('connect', sendHandshake);

        return () => {
            socket.off('connect', sendHandshake);
        };
    }, [user]);

    useEffect(() => {
        socket.on('receive_message', ReceiveMessage);

        return () => {
            socket.off('receive_message', ReceiveMessage);
        };
    }, []);

    return null;
}

export default SocketConnection;