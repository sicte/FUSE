import React from "react";

import { useAppSelector } from "../../redux/hookStore";
import { urlPost } from "../../api/APIs";

import PostSection from "../../components/PostSection";

function Feed() {
    const { isLoaded, categories, id } = useAppSelector(state => state.user);
    if (!isLoaded) return null;
    let url = categories.length > 0 ? `${urlPost}?categories=${categories.join(",")}` : urlPost;

    return (
        <div className="pb-2 space-y-4">
            <PostSection baseUrl={url} isUserPost={false} currUserId={id} />
        </div>
    );
}

export default React.memo(Feed);