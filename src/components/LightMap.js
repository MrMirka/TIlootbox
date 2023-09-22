import React, { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';
import { PMREMGenerator } from 'three';

export default function LightMap({hdriMap, isBackground}) {
  const { gl, scene } = useThree();


/* 
  useEffect(() => {
    const fileHdri = hdriMap ? hdriMap.name : './textures/Bronze_Silver_Gold_Chest_HDRI.exr';
    const loader = new EXRLoader();
    const pmremGenerator = new PMREMGenerator(gl);
    pmremGenerator.compileEquirectangularShader();
    loader.load(fileHdri, (texture) => {
      console.log(texture)
      const envMap = pmremGenerator.fromEquirectangular(texture).texture;
      scene.environment = envMap;

      texture.dispose();
      pmremGenerator.dispose();
    });

    return () => {
      // Освободите ресурсы, если это необходимо
      pmremGenerator.dispose();
    };
  }, [gl, scene, hdriMap]); */

  useEffect(() => {
    const pmremGenerator = new PMREMGenerator(gl);
    pmremGenerator.compileEquirectangularShader();
    const loader = new EXRLoader();
  
    if (hdriMap) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        loader.load(dataUrl, (texture) => {
          console.log(texture)
          const envMap = pmremGenerator.fromEquirectangular(texture).texture;
          scene.environment = envMap;
          if(isBackground) {
            scene.background = envMap;
          } else {
            scene.background = null;
          }
          
    
          texture.dispose();
          pmremGenerator.dispose();
        });
      };
      reader.readAsDataURL(hdriMap);
    } else {
      loader.load('./textures/hdri/Chest_HDRI_Grey_2.exr', (texture) => {
        console.log(texture)
        const envMap = pmremGenerator.fromEquirectangular(texture).texture;
        scene.environment = envMap;
        if(isBackground) {
          scene.background = envMap;
        } else {
          scene.background = null;
        }
  
        texture.dispose();
        pmremGenerator.dispose();
      });
    }
  
    return () => {
      // Освободите ресурсы, если это необходимо
      pmremGenerator.dispose();
    };
  }, [gl, scene, hdriMap, isBackground]);

  return null;
}
