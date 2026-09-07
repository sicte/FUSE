import React from "react";
import DarkVeil from "../reactbits/DarkVeil/DarkVeil";

function BGDarkVeil() {
    return (
        <DarkVeil
           speed={1.5}
           hueShift={40}
        />
    );
}

export default React.memo(BGDarkVeil);