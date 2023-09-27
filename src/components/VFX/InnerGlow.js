import React, { useRef, useEffect, useState, forwardRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from 'three'
import { TextureLoader } from "three";

const url = './textures/chest/VFX/glow2.jpg'
let textureGlow = null

const glowShader = {
  uniforms: {
    uTime: { value: 0 },
    rayTexture: { value: textureGlow }
  },
  vertexShader: `
      varying vec2 vUv;
      
  
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
  fragmentShader: `
    #ifdef GL_ES
    precision lowp float;
    #endif
    uniform float uTime;
    varying vec2 vUv;
    uniform sampler2D rayTexture;

    float random(float x) {
      return fract(sin(x) * 43758.5453);
   }
  
    float noise(float x) {
        float i = floor(x);
        float f = fract(x);
        float a = random(i);
        float b = random(i + 1.0);
        return mix(a, b, f);
    }

    void main(){
      vec2 uv = vUv;
      if (uv.y < 0.5) {
        uv.y = 0.0;
      }

      // Вычисление угла и радиуса в полярных координатах
      vec2 uv2 = uv * 2.0 - 1.0;

      float angle = atan(uv2.y, uv2.x) / (2.0 * 3.14159265359);
      angle = angle < 0.0 ? angle + 1.0 : angle;
      float rad = length(uv2);
  
      int index = int(angle * 100.0);
  
      // Используем шум вместо случайного значения
      float lineLength = noise(float(index) + uTime * 0.5 );
  
      //vec3 color = vec3(mod(float(index), 2.0), mod(float(index), 5.0), mod(float(index), 9.0)) / 9.0;
      vec3 color = vec3(0.9, 0.53, 0.15);
      float thickness = smoothstep(0.1, 0.2, 1.0 - rad) * 0.01 + 0.04;
  
      vec4 outputColor;
      if (rad < lineLength && abs(mod(angle * 50.0, 1.0) - 0.5) < thickness) {
          outputColor = vec4(color, 1.0);
      } else {
          outputColor = vec4(0.0, 0.0, 0.0, 1.0);
      }
      

      vec2 pos = 0.5 -uv;
      float dist = 1.0/length(pos);
      float distGradient = length(pos);
      dist *= 1.1 ;
      dist = pow(dist, 1.2);

      vec3 gold = vec3(0.9, 0.53, 0.15); 
      vec3 azur = vec3(1.2, 0.15, 0.2); 

      float t = smoothstep(0.0, 1.0, distGradient );
      t = pow(t,0.8); 
      vec3 finalColor =  mix( gold, azur, t);
      
      vec3 col_1 = dist * finalColor;
      col_1 = 1.0 - exp( -col_1 );
      
      vec4 ray =  texture(rayTexture, uv);
      col_1 += ray.r;
      col_1 += outputColor.r * 0.0075;
      
      float alpha = max(col_1.r, max(col_1.g, col_1.b)); 
      float finalAlpha = mix(0.0, 1.0, pow(alpha, 28.0));

      gl_FragColor = vec4(col_1, finalAlpha);
    }
    `
};

const InnerGlow = forwardRef(({position, rotation},ref) => {
  const textureLoader = new TextureLoader();
  const [updateMat, setUpdateMat] = useState(false)
  const mesh = useRef();
  const material = useRef();
  useFrame((state) => {
    material.current.uniforms.uTime.value = state.clock.elapsedTime;
  });
  useEffect(()=> {
    textureLoader.load(url, (texture) => {
        textureGlow = texture;
        setUpdateMat(true);
    })
}, [])

  useEffect (()=> {
      if(updateMat) {
          material.current.uniforms.rayTexture.value = textureGlow;
      }
  }, [textureGlow])

  return (
    <group ref={ref} position={position} rotation={rotation}>
      <mesh ref={mesh} scale={1} position={[0,0.467,0]} rotation = {[0 ,-0.6, 0]}>
        <planeGeometry args={[1, 0.5]} />
        <shaderMaterial
          side={THREE.DoubleSide}
          transparent
          ref={material}
          attach="material"
          args={[glowShader]}
        />
      </mesh>
    </group>
  );
});

export default InnerGlow;
