// import { usePlane } from '@react-three/cannon';
// import { Plane } from '@react-three/drei';
// import { useGLTF } from '@react-three/drei';

import { Color3, PhysicsImpostor } from '@babylonjs/core';

// useGLTF.preload(process.env.PUBLIC_URL + '/models/CirclePlane.gltf');

export function Floor({ invisible, ...props }) {
  // const [ref] = usePlane(() => ({ ...props, type: 'Static' }));

  // const shadowMaterial = useMemo(() => new ShadowOnlyMaterial("groundShadowMaterial"), []);
  // const groundMaterial = useMemo(() => new StandardMaterial("groundMaterial", ), []);

  return (
    <ground name="ground" isVisible={!invisible} receiveShadows={true} width={100} height={100}>
      <standardMaterial
        name="groundMaterial"
        diffuseColor={Color3.Gray()}
        alpha={invisible ? 0.0 : 1.0}
      />
      <physicsImpostor
        type={PhysicsImpostor.PlaneImpostor}
        _options={{
          mass: 0,
          friction: 1000,
        }}
      />
    </ground>
    // <Plane ref={ref} args={[10, 10]} receiveShadow>
    //   {invisible ? <shadowMaterial /> : <meshPhongMaterial color="gray" />}
    // </Plane>
  );
}
