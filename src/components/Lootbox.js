import React from "react";
//import InsertModel from "./InsertModel";
import GetModel from "./GetModel";
import InsertAnimModel from "./InsertAnimModel";


export default function LootBox({type, isPlay, modelExist, isOpen}) {
    return (
         <GetModel
            type= {type}
            modelExist = {modelExist}
        >
            {(mesh, textureAlbedo, isReady) => 
                isReady ? 
                    (<>
                        <InsertAnimModel
                            mesh = {mesh}
                            albedo = {textureAlbedo}
                            isPlay = {isPlay}
                            isOpen = {isOpen}
                        />
                    </>) 
                : null}
        </GetModel>   
            
    );
}

