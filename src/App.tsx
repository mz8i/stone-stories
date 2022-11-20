import { FC, ReactNode, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { World } from './World';
import _ from 'lodash';
// import { XRCanvas } from './xr/XRCanvas';

import './App.css';
import { Canvas, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import {
  Debug,
  Physics,
  RigidBody,
  useRapier,
  RigidBodyApiRef,
  Vector3Array,
  RigidBodyApi,
  useFixedJoint,
  useSphericalJoint,
  usePrismaticJoint,
  MeshCollider,
} from '@react-three/rapier';
import { StoneModel } from './stones/StoneModel';
import { Floor } from './Floor';
import { atom, RecoilRoot, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

const configurations = [
  {
    sessionType: 'immersive-ar',
    sessionInit: {
      requiredFeatures: ['local-floor'],
      optionalFeatures: ['hand-tracking'],
    },
    referenceSpace: 'local-floor',
  },
  {
    sessionType: 'immersive-vr',
    sessionInit: {
      requiredFeatures: ['local-floor'],
      optionalFeatures: ['hand-tracking'],
    },
    referenceSpace: 'local-floor',
  },
];

const debugState = atom({
  key: 'debugState',
  default: null,
});

const grabbingState = atom({
  key: 'grabbingState',
  default: false,
});

const GrabJoint: FC<{
  grabbedBody: RigidBodyApiRef;
  grabbingBody: RigidBodyApiRef;
  grabbingPoint: Vector3Array;
}> = ({ grabbedBody, grabbingBody, grabbingPoint }) => {
  useFixedJoint(grabbedBody, grabbingBody, [grabbingPoint, [0, 0, 0], [0, 0, 0], [0, 0, 0]]);
  // useSphericalJoint(grabbedBody, grabbingBody, [grabbingPoint, [0, 0, 0]]);

  return null;
};

function useDrag(onStart, onDrag, onEnd) {
  const [active, setActive] = useState(false);
  const activeRef = useRef<boolean>();
  const down = useCallback(
    (e) => {
      setActive(true);
      e.stopPropagation();
      e.target.setPointerCapture(e.pointerId);
      onStart?.(e);
    },
    [onStart],
  );
  const up = useCallback(
    (e) => {
      setActive(false);
      e.target.releasePointerCapture(e.pointerId);
      onEnd?.(e);
    },
    [onEnd],
  );
  const move = useCallback(
    (event) => {
      if (activeRef.current) {
        event.stopPropagation();
        onDrag?.(event);
      }
    },
    [onDrag],
  );
  useEffect(() => void (activeRef.current = active));
  return { onPointerDown: down, onPointerUp: up, onPointerMove: move };
}

function getDebug(e: ThreeEvent<PointerEvent>) {
  return _.cloneDeep({
    point: e.point,
    intersections: e.intersections,
  });
}

const Grabbable: FC<{ children: ReactNode }> = ({ children }) => {
  const setDebug = useSetRecoilState(debugState);
  const [isGrabbing, setIsGrabbing] = useState(false);
  const setGlobalGrabbing = useSetRecoilState(grabbingState);
  const [point, setPoint] = useState(null);
  const [localPoint, setLocalPoint] = useState(null);

  const [targetPosition, setTargetPosition] = useState(null);

  const bodyRef = useRef<RigidBodyApi>();
  const grabbingBodyRef = useRef<RigidBodyApi>();

  const handleDragStart = (e: ThreeEvent<PointerEvent>) => {
    const int = e.intersections[0];

    setIsGrabbing(true);
    setGlobalGrabbing(true);
    setLocalPoint(int.object.worldToLocal(int.point));
    setTargetPosition(e.point);
    setPoint(int.point);
    // setDebug(getDebug(e));
  };

  const handleDrag = (e: ThreeEvent<PointerEvent>) => {
    setTargetPosition(e.intersections[0].point);
    // setDebug(getDebug(e));
  };

  const handleDragEnd = (e: ThreeEvent<PointerEvent>) => {
    setIsGrabbing(false);
    setGlobalGrabbing(false);
    setTargetPosition(null);
    setLocalPoint(null);
    setPoint(null);
    setDebug(null);
  };

  const bindDrag = useDrag(handleDragStart, handleDrag, handleDragEnd);

  return (
    <>
      {isGrabbing && (
        <RigidBody type="fixed" ref={grabbingBodyRef} collisionGroups={0} position={targetPosition}>
          <Sphere scale={[0.1, 0.1, 0.1]}>
            <meshBasicMaterial color="blue" />
          </Sphere>
        </RigidBody>
      )}
      <group
        {...bindDrag}
        onPointerMissed={(e) => {
          console.log('Missed');
        }}
      >
        <RigidBody
          ref={bodyRef}
          type="dynamic"
          position={[0, 5, 0]}
          restitution={0}
          canSleep={true}
          mass={100}
        >
          {isGrabbing && grabbingBodyRef.current && (
            <GrabJoint
              grabbedBody={bodyRef}
              grabbingBody={grabbingBodyRef}
              grabbingPoint={localPoint}
            />
          )}
          {isGrabbing && point && (
            <Sphere position={point} scale={[0.1, 0.1, 0.1]}>
              <meshBasicMaterial color="red" />
            </Sphere>
          )}
          <MeshCollider type="hull">{children}</MeshCollider>
        </RigidBody>
      </group>
    </>
  );
};

function GameDebug() {
  const debug = useRecoilValue(debugState);

  return (
    debug && (
      <div
        style={{
          position: 'absolute',
          zIndex: 1000,
          right: 20,
          bottom: 20,
          width: '500px',
          maxHeight: '500px',
          overflowY: 'auto',
          backgroundColor: 'white',
          padding: '10px',
        }}
      >
        <pre>
          <code>{JSON.stringify(debug, null, 2)}</code>
        </pre>
      </div>
    )
  );
}
function Game() {
  const isGrabbing = useRecoilValue(grabbingState);
  return (
    <Canvas shadows camera={{ fov: 45, position: [10, 10, 0] }}>
      <ambientLight name="main-ambient-light" intensity={0.3} />
      <pointLight name="main-point-light" intensity={1.5} position={[0, 3, -2]} castShadow />

      <OrbitControls maxPolarAngle={Math.PI / 3} enabled={!isGrabbing} />
      <Physics colliders={null}>
        <Floor invisible={false} onPointerMove={() => void 0} />
        <Suspense fallback={null}>
          <Grabbable>
            <StoneModel type="rock-black" />
          </Grabbable>

          <Grabbable>
            <StoneModel type="rock-irregular" />
          </Grabbable>
        </Suspense>
        <Debug />
      </Physics>
      {/* <Suspense fallback={null}>
  <World type="vr" />
</Suspense> */}
    </Canvas>
  );
}
function App() {
  return (
    <div className="App">
      <main className="App-body">
        <RecoilRoot>
          <Game />
          {/* <GameDebug /> */}
        </RecoilRoot>
      </main>
    </div>
  );
}

export default App;
