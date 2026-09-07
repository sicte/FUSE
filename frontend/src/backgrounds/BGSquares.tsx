import React from "react";
import Squares from "../reactbits/Squares/Squares";

function BGSquares() {
    return (
        <div className="inset-0 w-screen h-screen bg-gradient-to-br from-[#271E37] via-[#1A1327] to-[#0F0B16]" >
            <Squares
                speed={0.5}
                squareSize={40}
                direction='down'
                borderColor='#271E37'
                hoverFillColor='#222222'
            />
        </div >
    );
}

export default React.memo(BGSquares);