import React, { useRef, useEffect, useState } from "react";
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
    uniform float uTime;
    varying vec2 vUv;
    uniform sampler2D rayTexture;

    vec2 randomVec2(vec2 co) {
      return vec2(fract(sin(dot(co, vec2(12.9898,78.233))) * 43758.5453),
                  fract(cos(dot(co, vec2(12.9898,78.233))) * 43758.5453));
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(dot(randomVec2(i), f - vec2(0.0,0.0)),
                     dot(randomVec2(i + vec2(1.0,0.0)), f - vec2(1.0,0.0)), u.x),
                 mix(dot(randomVec2(i + vec2(0.0,1.0)), f - vec2(0.0,1.0)),
                     dot(randomVec2(i + vec2(1.0,1.0)), f - vec2(1.0,1.0)), u.x), u.y);
    }

    void main(){
      vec2 uv = vUv;
      if (uv.y < 0.5) {
        uv.y = 0.0;
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

      float alpha = max(col_1.r, max(col_1.g, col_1.b)); 
      float finalAlpha = mix(0.0, 1.0, pow(alpha, 22.0));

      gl_FragColor = vec4(col_1, finalAlpha);
    }
    `
};

export default function GlowS({position, rotation}) {
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
          console.log('run')
          material.current.uniforms.rayTexture.value = textureGlow;
      }
  }, [textureGlow])

  return (
    <mesh ref={mesh} scale={1} position={position} rotation = {rotation}>
      <planeGeometry args={[1, 0.5]} />
      <shaderMaterial
      side={THREE.DoubleSide}
        transparent
        ref={material}
        attach="material"
        args={[glowShader]}
      />
    </mesh>
  );
}
