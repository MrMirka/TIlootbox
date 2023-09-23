import React, { useRef, forwardRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three'

const rayShader = {
    uniforms: {
        uTime: { value: 0 }
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
    precision mediump float;
    #endif
  
    uniform float uTime;
    varying vec2 vUv;
  
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
  
    void main() {
        vec2 uv = vUv * 2.0 - 1.0;
      vec2 lightDir = vec2(-1.8, 0.0);
      
      float angle = atan(uv.y - lightDir.y, uv.x - lightDir.x);
      float dist = length(uv - lightDir);
      
      float n = noise(uv * 3.3 - vec2(uTime * 0.5));
      float animatedAngle = angle + n * 0.1;
      float animatedDist = dist + n * 0.1;
  
      float intensity = smoothstep(0.32, 0.0, abs(animatedAngle)) / (animatedDist + 0.3);
      
      float falloff = 1.0 - smoothstep(0.0, 1.0, abs(animatedAngle) / 0.6);

      float rightFalloff = 1.0 - smoothstep(0.27, 2.0, 1.0 + uv.x );
      falloff *= rightFalloff;
      
      intensity *= falloff;
      
      
      vec3 col = intensity * vec3(1.0, 0.9, 0.0);
      float alpha = intensity;
      gl_FragColor = vec4(col, alpha);
    }
    `  
}





const Ray = forwardRef(({ position, rotation, scale }, ref) => {
    const mesh = useRef();
    const material = useRef();
    useFrame((state) => {
        material.current.uniforms.uTime.value = state.clock.elapsedTime;
    });

  return (
    <group ref={ref} position={position} rotation={rotation}>
    <mesh ref={mesh} scale={scale} position={[1, 0.37, 0]} >
      <planeGeometry args={[4, 3]} />
      <shaderMaterial
        side={THREE.DoubleSide}
        transparent={true}
        blending={THREE.CustomBlending}
        blendEquation={THREE.AddEquation}
        blendSrc={THREE.SrcAlphaFactor}
        blendDst={THREE.OneMinusSrcAlphaFactor}
        depthWrite={false} // Changed this to false
        //depthTest={false}  // Added this line to disable depth testing
        ref={material}
        attach="material"
        args={[rayShader]}
      />
    </mesh>
    </group>
  );
});

export default Ray;
