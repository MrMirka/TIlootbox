
import React, { useRef, useEffect, useMemo, useState } from "react";
import { useAnimations, PerspectiveCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from 'three'
import Ray from "./VFX/Ray";
import GlowS from "./VFX/GlowS";


export default function InsertAnimModel ({mesh, albedo, animationType, isPlay, angle, intensity,  props}) {
    const group = useRef();
    const camera = useRef()
    const meshRef = useRef();
    const rayRef = useRef();
    const { nodes, materials, animations } = mesh;
    const { actions } = useAnimations(animations, group);
    
    let mouseXY = new THREE.Vector2(0,0)
    window.addEventListener('mousemove', event => {
        let x = ( event.clientX - window.innerWidth / 2 ) * 0.0004
        let y = ( event.clientY - window.innerHeight / 2 ) * 0.0004
        mouseXY.set(x,y)
    })

    const angleRef = useRef(angle);
    angleRef.current = angle; 

    const intensityRef = useRef(intensity);
    intensityRef.current = intensity; 
    
    


    const newMaterial = useMemo(() => {
        const materialClone = materials.Chest.clone();
        materialClone.map = albedo;
        materials.Chest.envMapIntensity = intensityRef.current.current; 
        materials.Chest.depthWrite = true
        return materialClone;
      }, [materials, albedo]);


     useFrame(()=> {

        if (rayRef.current && meshRef.current) {
            rayRef.current.position.copy(meshRef.current.position);
           
        }

        if(newMaterial) {
            newMaterial.envMapIntensity = intensityRef.current.current; 
        }
        
        if (group.current) {
            group.current.rotation.y = angleRef.current.current * (Math.PI / 180) ;
          }
          if(mouseXY && camera.current) {
            //camera.current.rotation.x += ( mouseXY.y * 0.07 - camera.current.rotation.x * 0.4 ) * 1.3
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
      }, [actions, animationType, isPlay]);

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
                <GlowS position={[0,0.467,0]} rotation = {[0 ,-0.6, 0]}/>
               
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

