import React from "react";

import { useAppSelector } from "../../redux/hookStore";
import { urlPostPopular } from "../../api/APIs";

import PostSection from "../../components/PostSection";

function Popular() {
    const { isLoaded, id } = useAppSelector(state => state.user);
    if (!isLoaded) return null;

    return (
        <div className="pb-2 space-y-4">
            <PostSection baseUrl={urlPostPopular} isUserPost={false} currUserId={id} />
        </div>
    );
}

export default React.memo(Popular);