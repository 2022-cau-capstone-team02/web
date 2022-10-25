import { useFrame } from "@react-three/fiber";
import React, { useRef } from "react";
import Coin from "./Coin";
import Youtube from "./Youtube";

const Objects = () => {
  const groupRef = useRef();
  useFrame((state) => {
    if (window.innerWidth < 992) {
      groupRef.current.position.x = -0.4;
    } else if (window.innerWidth < 1400) {
      groupRef.current.position.x = -0.2;
    } else if (window.innerWidth < 1600) {
      groupRef.current.position.x = 0.2;
    } else {
      groupRef.current.position.x = 0.4;
    }
  });
  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <Coin />
      <Youtube />
    </group>
  );
};

export default Objects;
