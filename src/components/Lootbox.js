import React from "react";
import InsertModel from "./InsertModel";
import GetModel from "./GetModel";


export default function LootBox({type, callback}) {
    return (
     

         <GetModel
            type= {type}
            callback = {callback}
        >
            {(mesh, textureAlbedo, isReady) => 
                isReady ? 
                    (<>
                        <InsertModel
                            mesh = {mesh}
                            albedo = {textureAlbedo}
                        />
                    </>) 
                : null}
        </GetModel>   
            
    );
}

