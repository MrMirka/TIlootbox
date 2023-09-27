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
    precision lowp float;
    #endif
  
    uniform float uTime;
    varying vec2 vUv;
  
    // Функция поворота вектора
    vec2 rotate(vec2 v, float a) {
        float s = sin(a);
        float c = cos(a);
        return vec2(c * v.x - s * v.y, s * v.x + c * v.y);
    }

    vec4 createCone(vec2 uv, vec2 source, float coneAngle, float distMultiplier, float fadeOutMultiplier, float rotationAngle) {
      vec2 toUV = rotate(uv - source, rotationAngle);
      float angle = atan(toUV.y, toUV.x);
      float dist = length(toUV);
      float brightness = 1.0 / (0.1 + dist * distMultiplier);
      float fadeOut = 1.0 - smoothstep(0.0, fadeOutMultiplier, dist);
  
      // Начальный и конечный цвета.
      vec3 colorStart = vec3(0.9, 0.53, 0.15); 
      vec3 colorEnd = vec3(1.2, 0.15, 0.2); 
  
      // Интерполяция цвета на основе расстояния с использованием smoothstep
      float t = smoothstep(0.0, 1.0, dist / fadeOutMultiplier);
      vec3 color = mix(colorStart, colorEnd, t);
    
      if (abs(angle) < coneAngle) {
          return vec4(color * brightness, fadeOut);
      } else {
          return vec4(0.0, 0.0, 0.0, 0.0);
      }
    }
  
  
    void main() {
     
      vec2 uv = vUv;
      vec4 coneGlow = createCone(uv, vec2(0.0, 0.5), radians(23.0), 222.3, 0.30, 0.0);

      vec4 cone1 = createCone(uv, vec2(0.0, 0.5), radians(23.0), 0.6, 0.40, 0.0);
      vec4 cone2 = createCone(uv, vec2(0.0, 0.5), radians(5.0), 0.7, 0.23, radians(5.0)); 
      vec4 cone3 = createCone(uv, vec2(0.0, 0.5), radians(0.3), 0.7, 0.34, radians(17.0)); 
      vec4 cone4 = createCone(uv, vec2(0.0, 0.5), radians(5.2), 0.7, 0.33, radians(-12.0)); 
      vec4 cone5 = createCone(uv, vec2(0.0, 0.5), radians(0.4), 0.7, 0.30, radians(-18.0)); 
      vec4 cone6 = createCone(uv, vec2(0.0, 0.5), radians(7.4), 0.7, 0.25, radians(4.0)); 
      vec4 cone7 = createCone(uv, vec2(0.0, 0.5), radians(0.3), 0.7, 0.45, radians(13.0)); 
      vec4 cone8 = createCone(uv, vec2(0.0, 0.5), radians(1.2), 0.7, 0.45, radians(1.0)); 
      vec4 cone9 = createCone(uv, vec2(0.0, 0.5), radians(0.4), 0.7, 0.34, radians(0.0)); 
    
      gl_FragColor =  (cone2 * 0.08) +
                      (cone3 * 1.3)  + 
                      (cone4 * 0.09) + 
                      (cone5 * 2.15) + 
                      (cone6 * 0.12) + 
                      (cone7 * 0.05) + 
                      (cone8 * 0.08) + 
                      (cone9 * 0.33) + 
                      cone1 + 
                      coneGlow * 9.66;
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
    <mesh ref={mesh} scale={scale} position={[1.4, 0.37, 0]} >
      <planeGeometry args={[4, 1]} />
      <shaderMaterial
        side={THREE.DoubleSide}
        transparent={true}
        blending={THREE.CustomBlending}
        blendEquation={THREE.AddEquation}
        blendSrc={THREE.SrcAlphaFactor}
        blendDst={THREE.OneMinusSrcAlphaFactor}
        depthWrite={false} 
        ref={material}
        attach="material"
        args={[rayShader]}
      />
    </mesh>
    </group>
  );
});

export default Ray;
