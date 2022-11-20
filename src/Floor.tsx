import { Box, Plane } from '@react-three/drei';
import { useGLTF } from '@react-three/drei';
import { RigidBody } from '@react-three/rapier';

useGLTF.preload(process.env.PUBLIC_URL + '/models/CirclePlane.gltf');

export function Floor({ invisible, ...props }) {
  return (
    <group {...props}>
      <RigidBody colliders="cuboid" includeInvisible type="fixed">
        <group rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
          <Box args={[10, 10, 1]} receiveShadow>
            {invisible ? <shadowMaterial /> : <meshPhongMaterial color="gray" />}
          </Box>
        </group>
      </RigidBody>
    </group>
  );
}
