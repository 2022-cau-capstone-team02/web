import { PerspectiveCamera } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import React, { useRef } from 'react'

const Camera = () => {
    const cameraRef = useRef();
    return (
        <PerspectiveCamera ref={cameraRef} makeDefault position={[0.3,0.4,0.3]} rotation={[-0.5,-0.1,0]} fov={70}/>
    )
}

export default Camera
