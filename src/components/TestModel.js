import React from "react";
import { useGLTF } from "@react-three/drei";
export default function TestModel(props) {
    const { nodes, materials } = useGLTF("../models/model.gltf");
    return ( 
        <group {...props} dispose={null}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Suzanne.geometry}
          material={materials["Material.001"]}
        />
      </group>
    );
}
useGLTF.preload("../models/model.gltf");