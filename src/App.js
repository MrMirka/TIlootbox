import React, { useEffect, useRef, useState } from 'react'
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
import PostEffect from './components/VFX/PostEffect';
import WebGlHandler from './components/system/WebGlHandler';
import { isMobile } from 'react-device-detect';
import Ray from './components/VFX/Ray';

import GlowS from './components/VFX/GlowS';



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

   //Effects
   const[lum, setLum] = useState(0.1)
   const[smoo, setSmoo] = useState(0.2)
   const[bloo, setBluu] = useState(1.6)

   //Lights
   const [pointInside, setPointInside] = useState(0)
   const [lDistance, setLdistance] = useState(0.01)
   const [pX, setPx] = useState(0)
   const [pY, setPy] = useState(0)
   const [pZ, setPz] = useState(0)

   const handlePx = (e) => {
    setPx(e.target.value)
   }
   const handlePy = (e) => {
    setPy(e.target.value)
   }
   const handlePz = (e) => {
    setPz(e.target.value)
   }


   const handlePointInside = (e) => {
    setPointInside(e.target.value)
   }

   const handlePointDistance = (e) => {
    setLdistance(e.target.value)
   }


   const  handleLum = (e) => {
    setLum(e.target.value)
   }

   const  handSmoo = (e) => {
    setSmoo(e.target.value)
   }

   const  handleBloo = (e) => {
    setBluu(e.target.value)
   }
   
   //Controls
   const [displayIntensity, setdisplayIntensity] = useState(0);

    const angle = useRef(270); 
    const angleInputRef = useRef(null);

    const intensity = useRef(0.5); 
    const intensityInputRef = useRef(null);
    
    const callback = (e) => {
      console.log(e)
      setIsLoading(false)
    
    }
    const handlerLootboxType = (e) => {
      setTypeLootbox(e.target.value)
      setIsLoading(true)
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

    const hundleIntensity = (e) => {
      intensity.current = e.target.value;
      intensityInputRef.current.value = e.target.value;
      setdisplayIntensity(e.target.value);
    }

    useEffect(()=>{
      console.log(isLoading)
    },[isLoading])

    return(
      <>
      {isLoading && <ModelLoader />} 
    
     
      <Suspense fallback={null}>
       
        <Canvas 
          gl={{ logarithmicDepthBuffer: false, antialias: false, alpha: true, }}
          dpr={[1, 2]}
        >
          <WebGlHandler />
          <Stats />
       
          <LightMap  hdriMap = {hdriTexture} isBackground = {isBackground}/> 

          <pointLight position = {[pX, pY, pZ]} intensity={pointInside} distance={lDistance}/>
        
          <LootBox 
            type = {typeLootbox}
            animationType = {animationType}
            isPlay = {isPlay}
            angle = {angle}
            intensity = {intensity}
            callback = {callback}
          />  
         
          
        {/*   { !isMobile && (<PostEffect lum = {lum} smoo = {smoo} bloo = {bloo}/>) } */}
          {/* <InsideGlow /> */}
          

          
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
          <p>Интенсивность освещение: {displayIntensity}</p>
             <input
              ref={intensityInputRef}
              type="range"
              min="0"
              max="2"
              step="0.1"
              defaultValue={intensity.current} 
              onChange={hundleIntensity}
          />

          <p>Bloom luminanse: {lum}</p>
             <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              defaultValue={lum} 
              onChange={handleLum}
          />

          <p>Bloom smooth: {smoo}</p>
             <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              defaultValue={smoo} 
              onChange={handSmoo}
          />
           <p>Bloom intensity: {bloo}</p>
             <input
              type="range"
              min="0"
              max="5"
              step="0.1"
              defaultValue={bloo} 
              onChange={handleBloo}
          />

          <p>Свечение внутри сундука: {pointInside}</p>
             <input
              type="range"
              min="0"
              max="10"
              step="0.1"
              defaultValue={pointInside} 
              onChange={handlePointInside}
          />
          <p>Дистанция свеченияа: {lDistance}</p>
             <input
              type="range"
              min="0"
              max="1"
              step="0.001"
              defaultValue={lDistance} 
              onChange={handlePointDistance}
          />

            <p>X: {pX}</p>
             <input
              type="range"
              min="-3"
              max="3"
              step="0.02"
              defaultValue={pX} 
              onChange={handlePx}
          />
           <p>Y: {pY}</p>
             <input
              type="range"
              min="-3"
              max="3"
              step="0.02"
              defaultValue={pY} 
              onChange={handlePy}
          />
           <p>Z: {pZ}</p>
             <input
              type="range"
              min="-3"
              max="3"
              step="0.02"
              defaultValue={pZ} 
              onChange={handlePz}
          />
          
          </ControllersBox> 
        </>
    );
}