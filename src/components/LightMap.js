import React, { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';
import { PMREMGenerator } from 'three';

export default function LightMap({envExist}) {
  const { gl, scene } = useThree();

  useEffect(() => {
    const pmremGenerator = new PMREMGenerator(gl);
    pmremGenerator.compileEquirectangularShader();
    const loader = new EXRLoader();
    loader.load('./textures/hdri/Chest_HDRI_Grey_2.exr', (texture) => {
      if(texture) {
        const envMap = pmremGenerator.fromEquirectangular(texture).texture;
        scene.environment = envMap;
        texture.dispose();
        pmremGenerator.dispose();
        envExist(true)
      } else {
        envExist(false)
      }
      
    });

    return () => {
      pmremGenerator.dispose();
    };
  }, [gl, scene]);

  return null;
}
