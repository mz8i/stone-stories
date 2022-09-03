import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { useItemStore } from '../item-store';
import { stoneMetadata } from './StoneModel';
import { useStoneUpload } from './stone-upload';
import { STONE_MASS, useStonePhysics } from './use-stone-physics';
import { Model, useBeforeRender, useScene } from 'react-babylonjs';
import { AbstractMesh, Color3, Material, Mesh, PhysicsImpostor, Vector3 } from '@babylonjs/core';
import { PhysicsDragBehavior } from '../lib/PhysicsDragBehavior';

function useObservable(observable, callback) {
  useEffect(() => {
    const observer = observable?.add(callback);
    return () => {
      observable?.remove(observer);
    };
  });
}
export function Stone({ itemId, ...props }) {
  const set = useItemStore((store) => store.set);
  const item = useItemStore((store) => store.items[itemId]);

  // const [ref, api] = useStonePhysics(itemId);
  const [isGrabbing, setIsGrabbing] = useState(false);

  const [material, setMaterial] = useState<Material>();
  const [impostor, setImpostor] = useState<PhysicsImpostor>();
  // const impostorRef = useRef<PhysicsImpostor>();
  const [model, setModel] = useState<Mesh>();
  // const scene = useScene();

  // TODO add velocity ref and estimate on each frame

  //TODO
  /*
  useEffect(() => {
    if (!item.frozen) {
      if (isGrabbing) {
        api.mass.set(0);
        api.allowSleep.set(false);
        api.wakeUp();

        if (item.levitating) {
          set((store) => {
            store.items[itemId].touched = true;
          });
        }
      } else {
        if (item.levitating && item.touched) {
          api.mass.set(STONE_MASS);
          api.allowSleep.set(false);
          api.wakeUp();
          set((store) => {
            store.items[itemId].levitating = false;
          });
        }
        if (!item.levitating) {
          api.mass.set(STONE_MASS);
        }
        api.allowSleep.set(true);
      }
    }
  }, [isGrabbing, api, item.frozen, item.levitating, set, itemId, item.touched, item]);
  */

  //TODO
  // useStoneUpload(item, api, set);

  const virtual = !item.touched && item.id.startsWith('_');
  const hasGravity = !(isGrabbing || item.frozen || item.levitating);

  const [dragging, setDragging] = useState(false);

  const [dragBehavior] = useState(() => {
    const behavior = new PhysicsDragBehavior();
    behavior.allowMultiPointer = false;
    return behavior;
  });

  useEffect(() => {
    if (!impostor) return;
    if (!item.frozen) {
      dragBehavior.attach(model);
    }

    return () => {
      dragBehavior.detach();
    };
  }, [dragBehavior, item.frozen, model, impostor]);

  const handleDragStart = useCallback(() => {
    setIsGrabbing(true);
    set((store) => {
      store.items[itemId].touched = true;
      store.items[itemId].levitating = false;
    });
  }, [itemId, set]);

  useObservable(dragBehavior?.onDragStartObservable, handleDragStart);

  const handleDragEnd = useCallback(() => {
    setIsGrabbing(false);
    impostor?.setMass(hasGravity ? STONE_MASS : 0);
  }, [impostor, hasGravity]);

  useObservable(dragBehavior?.onDragEndObservable, handleDragEnd);

  useLayoutEffect(() => {
    if (material) {
      material.alpha = virtual ? 0.3 : 1;
      material.transparencyMode = virtual ? 2 : 0;
    }
  }, [material, virtual]);

  useEffect(() => {
    impostor?.setMass(hasGravity ? STONE_MASS : 0);
  }, [impostor, hasGravity]);

  const [modelLoaded, setModelLoaded] = useState(false);
  const metadata = stoneMetadata[item.model];
  return (
    <Model
      name={item.id}
      rootUrl={`${process.env.PUBLIC_URL}${metadata.basePath}`}
      sceneFilename={metadata.filename}
      meshNames={metadata.objectName}
      position={new Vector3(...item.position)}
      rotation={new Vector3(...item.rotation)}
      onModelLoaded={(model) => {
        const stoneMesh = model.meshes[1];
        setMaterial(stoneMesh.material);
        setModelLoaded(true);
        setModel(model.rootMesh as Mesh);
        // mesh.setParent(null);

        // impostorRef.current = new PhysicsImpostor(
        //   mesh,
        //   PhysicsImpostor.BoxImpostor,
        //   {
        //     mass: hasGravity ? STONE_MASS : 0,
        //     restitution: 0,
        //     friction: 100,
        //   },
        //   scene,
        // );
        // mesh.physicsImpostor = impostorRef.current;
      }}
    >
      {modelLoaded && (
        <physicsImpostor
          ref={setImpostor}
          type={PhysicsImpostor.ConvexHullImpostor}
          _options={{
            mass: hasGravity ? STONE_MASS : 0,
            restitution: 0,
            friction: 1000,
            disableBidirectionalTransformation: true,
          }}
        />
      )}
      {/* {isGrabbing && (
        <sphere name="pointer-sphere" diameter={0.5}>
          <standardMaterial name="pointer-sphere-material" diffuseColor={Color3.Red()} />
          <physicsImpostor
            type={PhysicsImpostor.NoImpostor}
            _options={{
              mass: 0,
            }}
          />
        </sphere>
      )} */}
      {/* <sixDofDragBehavior
        onDragStartObservable={handleDragStart}
        onDragEndObservable={handleDragEnd}
      /> */}
    </Model>
  );
}
