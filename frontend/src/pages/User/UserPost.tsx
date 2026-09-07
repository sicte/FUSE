import React from "react";
import { urlPostUser } from "../../api/APIs";
import PostSection from "../../components/PostSection";

type UserPost = {
    userId: number;
    currUserId: number;
}

function UserPost({ userId, currUserId }: UserPost) {

    let url = `${urlPostUser}?userId=${userId}`;

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl mt-6 p-4 sm:p-6 max-w-5xl mx-auto backdrop-blur-md shadow-md grid grid-cols-1 sm:grid-cols-2 gap-4">
            <PostSection baseUrl={url} isUserPost={true} currUserId={currUserId} />
        </div >
    );
}

export default React.memo(UserPost);