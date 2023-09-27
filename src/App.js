import React, { useEffect, useRef, useState } from 'react'
import { Suspense } from "react";
import { Stats } from "@react-three/drei";
import { Canvas } from '@react-three/fiber'
import LightMap from './components/LightMap';
import LootBox from './components/Lootbox';
import ControllersBox from './components/UI/ControllersBox';
import ModelLoader from './components/UI/ModelLoader';
import WebGlHandler from './components/system/WebGlHandler';

const lootBoxTypes = ['diamonds', 'gold', 'silver', 'bronze'];

export default function App() {
    const [typeLootbox, setTypeLootbox] = useState(lootBoxTypes[0]); //Какой сундук отображаем
    const [isPlay, setIsPlay] = useState(false); //Запуск анимации
    const [isLoading, setIsLoading] = useState(true); //Отображаем лоадер пока загружаься модель и освещение
    const [modelReady, setModelReady] = useState(false); //Готовность модели
    const [envReady, setEnvReady] = useState(false); //Готовность освещения

    /**
     * True - модель успешно загружена
     * @param {*} ready 
     */
    const handleModel = (ready) => {
      ready ? setModelReady(true) : setModelReady(false)
    }

    /**
     * True - текстура освещения успешно загружена
     * @param {*} ready 
     */
    const handleEnv = (ready) => {
      ready ? setEnvReady(true) : setEnvReady(false)
    }

    /**
     * Срабатывает когда завершается анимация сундука
     */
    const handleOpenChest = () => {
      console.log('Сундук открыт')
    } 

    const handlerLootboxType = (e) => {
      setTypeLootbox(e.target.value)
      setIsLoading(true)
      setModelReady(false)
    }
      /**
       * Обрабатываем нажатие на кнопку
       */
    const hundleOnPlay = () => {
      setIsPlay((v) => !v)
    }

    /**
     * Отключаем лоудер когда готовы данные
     */
    useEffect(()=> {
      if(modelReady && envReady) {
        setIsLoading(false)
      }
    }, [modelReady, envReady, typeLootbox])

    return(
      <>
      {isLoading && <ModelLoader />} 
      <Suspense fallback={null}>
        <Canvas 
          gl={{ logarithmicDepthBuffer: false, antialias: false, alpha: true, }}
          dpr={[1, 2]}
        >
          <WebGlHandler />
          <LightMap envExist = {handleEnv}/> 
          <LootBox 
            type = {typeLootbox}
            isPlay = {isPlay}
            modelExist = {handleModel}
            isOpen = {handleOpenChest}
          />  
          </Canvas>
        </Suspense>
        /

        <ControllersBox>
              <select onChange={handlerLootboxType}>
              {lootBoxTypes.map((lootbox) => (
                <option key={lootbox}>{lootbox}</option>
              ))}
            </select>
            <br />
             <button onClick={hundleOnPlay}>{!isPlay ? 'Play' :'Stop'}</button> 
            <br/>
        </ControllersBox> 
        </>
    );
}