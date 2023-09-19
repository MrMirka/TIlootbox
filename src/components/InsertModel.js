import React, { useMemo } from "react";
export default function InsertModel ({mesh, albedo, props}) {
    const { nodes, materials } = mesh;
    const newMaterial = useMemo(() => {
        const materialClone = materials.Chest.clone();
        materialClone.map = albedo;
        materials.Chest.envMapIntensity = 2.5; 
        return materialClone;
      }, [materials, albedo]);
    return (
        <group {...props} dispose={null}>
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Chest_low.geometry}
                material={newMaterial}
            />
         </group>
    );
}

