import React from "react";
import "./TileButton.css"

const getColor = num => {
    switch(num) {
        case 0:
            return "Black";
        case 1:
            return "Red";
        case 2:
            return "Blue";
        
        default:
            return "Black";
    }
}

const TileButton = ({tileIdProp, tileColorProp, updateTile}) => 
{
    console.log(tileIdProp);
    
    return(
            <button 
                className="tile"
                onClick={ () => { updateTile(tileIdProp, tileColorProp) } }
                style={{background: getColor(tileColorProp)}}>
            </button>
        )
}

export default TileButton;