import React from "react";
import { EffectComposer, SSR, Bloom, LUT } from '@react-three/postprocessing'

function PostEffect({lum, smoo, bloo}) {

    

    return (
        <EffectComposer disableNormalPass>
            <Bloom luminanceThreshold={lum} mipmapBlur luminanceSmoothing={smoo} intensity={bloo} />
        </EffectComposer>
    );
}

export default PostEffect;