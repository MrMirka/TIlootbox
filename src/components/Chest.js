import React from "react";
import { useGLTF } from "@react-three/drei";
export default function Chest(props) {
    const { nodes, materials } = useGLTF("../models/Chest_Test.gltf");
    return ( 
      <group {...props} dispose={null}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Chest_low.geometry}
          material={materials.Chest}
        />
    </group>
    );
}
useGLTF.preload("../models/Chest_Test.gltf");