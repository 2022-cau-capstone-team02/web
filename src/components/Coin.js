import { useGLTF } from '@react-three/drei';
import React, { useLayoutEffect, useRef } from 'react';

const Coin = () => {
  const coin = useGLTF('./interesting_coin/interesting_coin.glb');
  const coinRef = useRef();
  useLayoutEffect(
    () => coin.scene.traverse((o) => o.isMesh && (o.castShadow = o.receiveShadow = true)),
    [],
  );
  return (
    <>
      <primitive
        ref={coinRef}
        object={coin.scene}
        rotation={[-Math.PI / 3, -Math.PI / 4, 0]}
        position={[0.5, 0.1, -0.4]}
        scale={[1.5, 1.5, 1.5]}
      />
    </>
  );
};

export default Coin;
