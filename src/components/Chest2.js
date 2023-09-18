import React, { useRef, useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
export default function Chest2(props) {
    const group = useRef();
    const { nodes, materials, animations } = useGLTF("../models/Diamonds.gltf");
    const { actions } = useAnimations(animations, group);
    materials.Chest.envMapIntensity = 1; 
   
    useEffect(() => {
      // Здесь вы можете выбрать нужную анимацию. 
      // Например, если у вас есть анимация с именем "open", вы можете её запустить.
      console.log(actions)
     // actions.Chest_lowAction.play();
    }, [actions]);
    return ( 
      <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <mesh
          name="Chest_low"
          castShadow
          receiveShadow
          geometry={nodes.Chest_low.geometry}
          material={materials.Chest}
        />
      </group>
    </group>
    );
}
useGLTF.preload("../models/Chest_Test_2.gltf");