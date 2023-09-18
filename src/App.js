import React, { useRef, useState } from 'react'
import { Suspense } from "react";
import { OrbitControls } from '@react-three/drei';
import { Stats } from "@react-three/drei";
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import LightMap from './components/LightMap';
import LootBox from './components/Lootbox';
import ControllersBox from './components/UI/ControllersBox';


const lootBoxTypes = ['diamonds', 'gold', 'silver', 'bronze'];


export default function App() {
   const [typeLootbox, setTypeLootbox] = useState(lootBoxTypes[0]);
    const callback = (e) => {
      console.log(e)
    }
    const handlerLootboxType = (e) => {
      setTypeLootbox(e.target.value)
    }
    return(
      <Suspense fallback={null}>
        <Canvas 
          gl={{
            alpha: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            outputEncoding: THREE.sRGBEncoding
          }}
        >
           <Stats />
          <LightMap />
          
          <LootBox 
            type = {typeLootbox}
            callback = {callback}
          />   

          <OrbitControls />
        </Canvas>
        <ControllersBox>
            <p>Тип сундука</p>
            <select onChange={handlerLootboxType}>
            {lootBoxTypes.map((lootbox) => (
              <option key={lootbox}>{lootbox}</option>
            ))}
          </select>
        </ControllersBox>
        
        </Suspense>
    );
}