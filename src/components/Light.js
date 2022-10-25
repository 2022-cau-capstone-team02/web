import { useHelper } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useRef } from "react";
import { PointLightHelper, SpotLightHelper } from "three";

const Light = () => {
  const spotRef = useRef();
  useHelper(spotRef, SpotLightHelper, "red");
  return (
    <>
      <ambientLight intensity={0.3} />
      <spotLight
        ref={spotRef}
        castShadow
        color="#fff36b"
        intensity={0.8}
        decay={0.1}
        penumbra={0.5}
        angle={0.3}
        position={[0, 0.5, 1]}
      />
      {/* <spotLight ref={spotRef3} color='#fff36b' intensity={2} decay={0.5} position={[0, 0, 3]}/> */}
    </>
  );
};

export default Light;
