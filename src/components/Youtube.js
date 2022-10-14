import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber';
import React, { useLayoutEffect, useRef, memo } from 'react'

const Youtube = () => {
  const youtube = useGLTF('./youtube_logo/youtube_logo.glb');
  const youtubeRef = useRef();
  useLayoutEffect(() => youtube.scene.traverse(o => o.isMesh && (o.castShadow = o.receiveShadow = true)), [])

return (
  <>
    <primitive ref={youtubeRef} object={youtube.scene} rotation={[-Math.PI/2,0, 0]} position={[1, -0.1, -0.4 ]} scale={[0.25, 0.25, 0.25]}/>
  </>
)
}

export default Youtube

