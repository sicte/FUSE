export interface MessageData {
    messages: Message[];
    currPage: number;
    totalPages: number;
}

export interface Message {
    id: string;
    sender_id: number;
    receiver_id: number;
    sender_username: string;
    sender_image_url: string;
    message: string;
    media_url: string,
    created_at: string;
}

export const getInitialMessage = (): Message => ({
    id: '',
    sender_id: 0,
    receiver_id: 0,
    sender_username: '',
    sender_image_url: '',
    message: '',
    media_url: '',
    created_at: '',
});