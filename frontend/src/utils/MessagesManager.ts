import messages from "../data/messages.json";

export default function GetMessage(category: keyof typeof messages): string {
    const messageList = messages[category];
    if (!messageList || messageList.length === 0) return "An error occurred";
    const index = Math.floor(Math.random() * messageList.length);
    return messageList[index];
}