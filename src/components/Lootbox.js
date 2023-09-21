import React from "react";
//import InsertModel from "./InsertModel";
import GetModel from "./GetModel";
import InsertAnimModel from "./InsertAnimModel";


export default function LootBox({type, animationType, isPlay,  angle, callback}) {
    return (
         <GetModel
            type= {type}
            callback = {callback}
        >
            {(mesh, textureAlbedo, isReady) => 
                isReady ? 
                    (<>
                        <InsertAnimModel
                            mesh = {mesh}
                            albedo = {textureAlbedo}
                            animationType = {animationType}
                            isPlay = {isPlay}
                            angle = {angle}
                        />
                    </>) 
                : null}
        </GetModel>   
            
    );
}

