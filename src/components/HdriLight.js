import React from 'react';
import { useThree, useLoader } from '@react-three/fiber';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

import { PMREMGenerator } from 'three';

export default function HdriLight() {
  const { gl, scene } = useThree();
  const texture = useLoader(RGBELoader, "../textures/Chest_HDR.hdr");

  // Преобразовать HDRI-текстуру для использования как окружающую карту
  const pmremGenerator = new PMREMGenerator(gl);
  pmremGenerator.compileEquirectangularShader();

  const envMap = pmremGenerator.fromEquirectangular(texture).texture;
  pmremGenerator.dispose();

  // Установить окружающую карту
  scene.environment = envMap;

  return null;
}
