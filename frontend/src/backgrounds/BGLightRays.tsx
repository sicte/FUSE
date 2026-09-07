import React from "react";
import LightRays from "../reactbits/LightRays/LightRays";

function BGLightRays() {
    return (
        <LightRays
            raysOrigin="top-center"
            raysColor="#391C7D"
            raysSpeed={1.7}
            lightSpread={1.3}
            rayLength={3}
            followMouse={true}
            mouseInfluence={0.1}
            noiseAmount={0}
            distortion={0}
            className="custom-rays"
        />
    );
}

export default React.memo(BGLightRays);