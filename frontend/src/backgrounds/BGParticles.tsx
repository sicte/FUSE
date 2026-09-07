import React from "react";
import Particles from "../reactbits/Particles/Particles";

function BGParticles() {
    return (
        <Particles
            particleColors={['#ffffff', '#ffffff']}
            particleCount={200}
            particleSpread={10}
            speed={0.1}
            particleBaseSize={100}
            moveParticlesOnHover={true}
            alphaParticles={false}
            disableRotation={false}
        />
    );
}

export default React.memo(BGParticles);