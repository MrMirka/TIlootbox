import React, { useRef, useEffect } from "react";
import { useGLTF, useAnimations, PerspectiveCamera } from "@react-three/drei";
export default function AnimationChest(props) {
    const group = useRef();
    const { nodes, materials, animations } = useGLTF("./models/Chests_Animation.gltf");
    const { actions } = useAnimations(animations, group);
   
   
    useEffect(() => {
      console.log(actions)
      //actions.Zoom.play();
      actions.Shake.play();
      actions.Open.play();
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
          material={nodes.Chest_Bottom.material}
        >
          <mesh
            name="Chest_Cap"
            castShadow
            receiveShadow
            geometry={nodes.Chest_Cap.geometry}
            material={nodes.Chest_Cap.material}
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
useGLTF.preload("../models/Chest_Test_2.gltf");