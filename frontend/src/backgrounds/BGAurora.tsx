import React from "react";
import Aurora from "../reactbits/Aurora/Aurora";

function BGAurora() {
    return (
        <Aurora
            colorStops={["#140A50", "#3A1120", "#330C0C"]}
            // colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
            blend={0.5}
            amplitude={1.0}
            speed={0.5}
        />
    );
}

export default React.memo(BGAurora);