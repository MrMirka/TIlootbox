import React, { useEffect } from 'react';
import { useThree } from '@react-three/fiber';

function WebGlHandler() {
    const { gl } = useThree();
    useEffect(()=>{
        function handleContextLost(event) {
            event.preventDefault();
        }

        function handleContextRestored(event) {
            initializeResourcesAndState();
        }

        gl.domElement.addEventListener('webglcontextlost', handleContextLost, false);
        gl.domElement.addEventListener('webglcontextrestored', handleContextRestored, false);

        return ()=> {
            gl.domElement.removeEventListener('webglcontextlost', handleContextLost, false);
            gl.domElement.removeEventListener('webglcontextrestored', handleContextLost, false);
        }
    },[gl])
    return null;
}

export default WebGlHandler;