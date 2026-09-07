import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";

import BGAurora from "./BGAurora";
import BGSquares from "./BGSquares";
// import BGDarkVeil from "./BGDarkVeil";
// import BGLightRays from "./BGLightRays";
// import BGParticles from "./BGParticles";
import BGHyperspeed from "./BGHyperspeed";

import { routeAuth } from "../utils/Routes";

function SetBG() {
    const location = useLocation();

    const isAuth = location.pathname === routeAuth;

    const Background = useMemo(() => {
        if (isAuth) return BGHyperspeed;
        const backgrounds = [BGAurora, BGSquares];
        const randomIndex = Math.floor(Math.random() * backgrounds.length);
        return backgrounds[randomIndex];
    }, [isAuth]);


    return (
        <div className="fixed inset-0 -z-100">
            <Background />
        </div>
    );
}

export default React.memo(SetBG);