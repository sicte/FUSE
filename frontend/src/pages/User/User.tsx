import React from "react";
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../redux/hookStore';

import UserPost from "./UserPost";
import UserSection from "./UserSection";

function User() {
    const params = useParams();
    const user = useAppSelector((state) => state.user);

    let userId = parseInt(params.userId ?? '');
    if (isNaN(userId) || userId < 1) userId = user.id;
    if (userId < 1) return <div className="text-white p-4">Loading user data...</div>;

    return (
        <>
            <UserSection userId={userId} />
            <UserPost userId={userId} currUserId={user.id} />
        </>
    );
}

export default React.memo(User);