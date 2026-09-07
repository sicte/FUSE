export interface PostData {
    posts: Post[];
    currPage: number;
    totalPages: number;
}

export interface Post {
    id: number
    user_id: number;
    post_title: string;
    post_body: string;
    media_url: string;
    created_at: string;
    category: string;
    username: string;
    user_image_url: string | null;
    likes: number;
    isLiked: boolean;
    comments: number;
    isCommented: boolean;
}

export const getInitialPosts = (): PostData => ({
    posts: [],
    currPage: -1,
    totalPages: -1,
});