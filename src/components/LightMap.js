import React, { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';
import { PMREMGenerator } from 'three';

export default function LightMap({angle}) {
  const { gl, scene } = useThree();

  useEffect(() => {
    const loader = new EXRLoader();
    const pmremGenerator = new PMREMGenerator(gl);
    pmremGenerator.compileEquirectangularShader();
    loader.load('./textures/Bronze_Silver_Gold_Chest_HDRI.exr', (texture) => {
      const envMap = pmremGenerator.fromEquirectangular(texture).texture;
      scene.environment = envMap;

      texture.dispose();
      pmremGenerator.dispose();
    });

    return () => {
      // Освободите ресурсы, если это необходимо
      pmremGenerator.dispose();
    };
  }, [gl, scene, angle]);

  return null;
}
