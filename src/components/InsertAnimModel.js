
import React, { useRef, useEffect, useMemo, useState } from "react";
import { useAnimations, PerspectiveCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from 'three'

export default function InsertAnimModel ({mesh, albedo, animationType, isPlay, angle,  props}) {
    const group = useRef();
    const { nodes, materials, animations } = mesh;
    const { actions } = useAnimations(animations, group);

    const angleRef = useRef(angle);
    angleRef.current = angle; 
   console.log( angleRef.current.current)


     useFrame(()=> {
        if (group.current) {
            group.current.rotation.y = angleRef.current.current * (Math.PI / 180) ;
          }
    }) 


    const newMaterial = useMemo(() => {
        const materialClone = materials.Chest.clone();
        materialClone.map = albedo;
        materials.Chest.envMapIntensity = 1.5; 
        return materialClone;
      }, [materials, albedo]);

      useFrame(()=> {
        if (group.current) {
            //group.current.rotation.y += 0.003;
            //group.current.rotation.y = hdriAngel ;
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
         
       //actions.Zoom.play();
        //actions.Shake.play();
         //actions.Open.play();
      }, [actions, animationType, isPlay]);

    return (
        <group ref={group} {...props} dispose={null}>
            <group name="Scene">
                <PerspectiveCamera
                name="Cam_Anim_Baked"
                makeDefault={true}
                far={1000}
                near={0.1}
                fov={14.426}
                position={[-8.858, 3.692, 12.192]}
                rotation={[-0.32, -0.604, -0.186]}
                scale={0.961}
                />
                <mesh
                name="Chest_Bottom"
                castShadow
                receiveShadow
                geometry={nodes.Chest_Bottom.geometry}
                material={newMaterial}
                >
                <mesh
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
    );
}

