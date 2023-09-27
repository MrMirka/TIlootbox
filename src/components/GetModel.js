import React, { Children } from "react";
import { useGLTF } from "@react-three/drei";
import { useEffect, useState } from "react";
import { TextureLoader, sRGBEncoding, RepeatWrapping, SRGBColorSpace } from "three";


const textureLoader = new TextureLoader();

const types = {
    gold: {
        mesh: './models/regular/Regular.gltf',
        albedo: './textures/chest/Gold/Chest_Gold_color_sRGB.jpg'
    },
    silver: {
        mesh: './models/regular/Regular.gltf',
        albedo: './textures/chest/Silver/Chest_Silver_color_sRGB.jpg'
    },
    bronze: {
        mesh: './models/regular/Regular.gltf',
        albedo: './textures/chest/Bronze/Chest_Bronze_color_sRGB.jpg'
    },
    diamonds: {
        mesh: './models/diamond/Diamond.gltf',
        albedo: './textures/chest/Diamonds/Chest_Base_color_sRGB.jpg',
    }
};

export default function  GetModel({type, children, modelExist}) {
    const mesh = useGLTF(types[type].mesh);
    const [isReady, setIsReady] = useState(false);
    const [textureAlbedo, setTextureAlbedo] = useState(null);

    
    const loadTexture = (url) =>
        new Promise((resolve, reject) => {
            textureLoader.load(
            url,
            (texture) => {
                texture.encoding = sRGBEncoding;
                texture.wrapS = RepeatWrapping;
                texture.wrapT = RepeatWrapping;
                setTextureAlbedo(texture);
                resolve();
            },
            undefined,
            (error) => {
                reject(error)
            }
            );
  });

    useEffect(()=>{
        Promise.all([
            loadTexture(types[type].albedo).then(()=>{
                if(mesh) {
                    setIsReady(true)
                    modelExist(true)
                } else {
                    modelExist(false)
                }
            })
        ])
    }, [mesh, type])

    return children(mesh, textureAlbedo, isReady);
}

