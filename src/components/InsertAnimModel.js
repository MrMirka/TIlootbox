
import React, { useRef, useEffect, useMemo } from "react";
import { useAnimations, PerspectiveCamera } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

export default function InsertAnimModel ({mesh, albedo, props}) {
    const group = useRef();
    const { nodes, materials, animations } = mesh;
    const { actions } = useAnimations(animations, group);
    

    const newMaterial = useMemo(() => {
        const materialClone = materials.Chest.clone();
        materialClone.map = albedo;
        materials.Chest.envMapIntensity = 1.5; 
        return materialClone;
      }, [materials, albedo]);

      useFrame(()=> {
        if (group.current) {
            group.current.rotation.y += 0.009;
          }
      })

      useEffect(() => {
        //actions.Zoom.play();
        //actions.Shake.play();
        //actions.Open.play();
      }, [actions]);

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
                <PerspectiveCamera
                name="Cam_Anim"
                makeDefault={false}
                far={1000}
                near={0.1}
                fov={14.426}
                position={[-8.858, 3.692, 12.192]}
                rotation={[-0.32, -0.604, -0.186]}
                scale={0.961}
                />
            </group>
        </group>
    );
}

