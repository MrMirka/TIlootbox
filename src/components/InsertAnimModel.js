
import React, { useRef, useEffect, useMemo, useState } from "react";
import { useAnimations, PerspectiveCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from 'three'
import Ray from "./VFX/Ray";
import InnerGlow from "./VFX/InnerGlow";


export default function InsertAnimModel ({mesh, albedo, isPlay, isOpen, props}) {
    const group = useRef();
    const camera = useRef()
    const meshRef = useRef();
    const rayRef = useRef();
    const innerGlowRef = useRef();
    const { nodes, materials, animations } = mesh;
    const { actions } = useAnimations(animations, group);
    
    let mouseXY = new THREE.Vector2(0,0)
    window.addEventListener('mousemove', event => {
        let x = ( event.clientX - window.innerWidth / 2 ) * 0.0004
        let y = ( event.clientY - window.innerHeight / 2 ) * 0.0004
        mouseXY.set(x,y)
    })

    const newMaterial = useMemo(() => {
        const materialClone = materials.Chest.clone();
        materialClone.map = albedo;
        materials.Chest.envMapIntensity = 1; 
        materials.Chest.depthWrite = true
        return materialClone;
      }, [materials, albedo]);


     useFrame(()=> {

        if (rayRef.current && meshRef.current) {
            rayRef.current.position.copy(meshRef.current.position);
           
        }
        if (innerGlowRef.current && meshRef.current) {
            innerGlowRef.current.position.copy(meshRef.current.position);
        }

        if (group.current) {
            group.current.rotation.y = 270 * (Math.PI / 180) ;
          }
          if(mouseXY && camera.current && !isPlay) {
            camera.current.rotation.y += ( mouseXY.x  * 0.15 - camera.current.rotation.y * 0.3 ) * 1.5
          }
          
    }) 

      useEffect(() => {
         actions.Zoom.stop();
         actions.Shake.stop();
         actions.Open.stop();
         actions.Zoom.loop = THREE.LoopOnce;
         actions.Zoom.clampWhenFinished = true;

        actions.Shake.loop = THREE.LoopOnce;
        actions.Shake.clampWhenFinished = true;

        actions.Open.loop = THREE.LoopOnce;
        actions.Open.clampWhenFinished = true;
        if (isPlay) {
            actions.Zoom.play();
            actions.Shake.play();
            actions.Open.play();
        }
      }, [actions, isPlay]);

      useEffect(() => {
        if (isPlay) {
            const timer = setTimeout(() => {
                isOpen()
            }, 3 * 1000); 
            return () => clearTimeout(timer);
        }
    }, [actions, isPlay]);

    return (
        <>
        <group ref={group} {...props} dispose={null}> 
            <group name="Scene">
                <PerspectiveCamera
                name="Cam_Anim_Baked"
                makeDefault={true}
                far={1000}
                near={1}
                fov={14.426}
                position={[-8.858, 3.692, 12.192]}
                rotation={[-0.32, -0.604, -0.186]}
                scale={0.961}
                />
                <group ref={camera} {...props} dispose={null}>
                <Ray ref={rayRef} position={[42, 0.38, 0]} rotation = {[0,-Math.PI,0]} scale = {1}/>
                 <InnerGlow ref={innerGlowRef}/>
                    <mesh
                    ref={meshRef}
                    name="Chest_Bottom"
                    castShadow 
                    receiveShadow 
                    geometry={nodes.Chest_Bottom.geometry}
                    material={newMaterial}
                    >
                    <mesh
                    ref={meshRef}
                        name="Chest_Cap"
                        castShadow  
                        receiveShadow 
                        geometry={nodes.Chest_Cap.geometry}
                        material={newMaterial}
                        position={[0, 0.651, -0.385]}
                    />
                    </mesh>
                </group>
            </group>
        </group>
        </>

    );
}

