export interface CommentData {
    comments: Comment[];
    currPage: number;
    totalPages: number;
}

export interface Comment {
    id: number;
    comment: string;
    username: string;
    user_image_url: string;
    isUserComment: boolean;
    created_at: string;
}

export interface AllComment {
    id: number;
    userId: number;
    username: string;
    comment: string;
    created_at: string;
}

export const getInitialPosts = (): CommentData => ({
    comments: [],
    currPage: -1,
    totalPages: -1,
});