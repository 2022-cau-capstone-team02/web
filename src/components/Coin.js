import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber';
import React, { useLayoutEffect, useRef, memo } from 'react'

const Coin = () => {
    const coin = useGLTF('./interesting_coin/scene.gltf');
    const coinRef = useRef();
    useLayoutEffect(() => coin.scene.traverse(o => o.isMesh && (o.castShadow = o.receiveShadow = true)), [])

    useFrame((state)=>{
        coinRef.current.rotation.y += 0.005;
        if(window.innerWidth < 992){
          coinRef.current.position.x = 0;
        }
        else if(window.innerWidth < 1400){
          coinRef.current.position.x = 0.5;
        }
        else if(window.innerWidth < 1600){
          coinRef.current.position.x = 0.6;
        }
        else{
          coinRef.current.position.x = 0.8;
        }
    })
  return (
    <>
      <primitive ref={coinRef} object={coin.scene} rotation={[0,0, -Math.PI/15]} position={[0.8, 0.05, -0.6 ]} />
    </>
  )
}

export default Coin
