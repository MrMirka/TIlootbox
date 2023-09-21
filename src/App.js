import React, { useRef, useState } from 'react'
import { Suspense } from "react";
import { OrbitControls } from '@react-three/drei';
import { Stats } from "@react-three/drei";
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import LightMap from './components/LightMap';
import LootBox from './components/Lootbox';
import ControllersBox from './components/UI/ControllersBox';
import InputFile from './components/UI/InputFile';
import ModelLoader from './components/UI/ModelLoader';



const lootBoxTypes = ['diamonds', 'gold', 'silver', 'bronze'];
const animations = ['zoom', 'open'];


export default function App() {
   const [typeLootbox, setTypeLootbox] = useState(lootBoxTypes[0]);
   const [animationType, setAnimationType] = useState(animations[0]);
   const [displayAngle, setDisplayAngle] = useState(0); 
   const [isPlay, setIsPlay] = useState(false);
   const [hdriTexture, setHdriTexture] = useState(null);
   const [isBackground, setisBackground] = useState(false);
   const [isLoading, setIsLoading] = useState(true)

    const angle = useRef(0); 
    const angleInputRef = useRef(null);
    
    const callback = (e) => {
      console.log(e)
      setIsLoading(false)
    
    }
    const handlerLootboxType = (e) => {
      setTypeLootbox(e.target.value)
      //setIsLoading(true)
    }

    const hundleAnimation = (e) => {
      setAnimationType(e.target.value)
    }

    const handleCheckboxChange = (e) => {
      setisBackground(e.target.checked)
    }

    const hundleOnPlay = () => {
      setIsPlay((v) => !v)
    }

    const hundleAngle = (e) => {
      angle.current = e.target.value;
      angleInputRef.current.value = e.target.value;
      setDisplayAngle(e.target.value);
    }

    return(
      <>
      <Suspense fallback={null}>
        <Canvas 
          gl={{
            alpha: true,
            //toneMapping: THREE.ACESFilmicToneMapping,
            outputEncoding: THREE.sRGBEncoding
          }}
        >
          <Stats />
          <LightMap  hdriMap = {hdriTexture} isBackground = {isBackground}/>

          <LootBox 
            type = {typeLootbox}
            animationType = {animationType}
            isPlay = {isPlay}
            angle = {angle}
            callback = {callback}
          />  
          </Canvas>
        </Suspense>
        <ControllersBox>
              <p>Тип сундука</p>
              <select onChange={handlerLootboxType}>
              {lootBoxTypes.map((lootbox) => (
                <option key={lootbox}>{lootbox}</option>
              ))}
            </select>
            <br />
           {/*  <p>Тип анимации</p>
              <select onChange={hundleAnimation}>
              {animations.map((anim) => (
                <option key={anim}>{anim}</option>
              ))}
            </select> */}
            <button onClick={hundleOnPlay}>{!isPlay ? 'Play' :'Stop'}</button>
            <br/>
             <p>Угол поворота сцены: {displayAngle}</p>
             <input
              ref={angleInputRef}
              type="range"
              min="0"
              max="360"
              step="1"
              defaultValue={angle.current} 
              onChange={hundleAngle}
          />
          <input
            type="checkbox"
            checked={isBackground}
            onChange={handleCheckboxChange}
         />
         
          <InputFile 
            setFile = {setHdriTexture}
          />
          
          </ControllersBox> 
          {isLoading && <ModelLoader />}
        </>
    );
}