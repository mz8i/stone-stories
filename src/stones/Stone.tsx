import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useItemStore } from '../item-store';
import { stoneMetadata } from './StoneModel';
import { useStoneUpload } from './stone-upload';
import { STONE_MASS, useStonePhysics } from './use-stone-physics';
import { Model, useBeforeRender, useScene } from 'react-babylonjs';
import { AbstractMesh, Material, PhysicsImpostor, Vector3 } from '@babylonjs/core';

export function Stone({ itemId, ...props }) {
  const set = useItemStore((store) => store.set);
  const item = useItemStore((store) => store.items[itemId]);

  // const [ref, api] = useStonePhysics(itemId);
  const [isGrabbing, setIsGrabbing] = useState(false);

  const [material, setMaterial] = useState<Material>();
  const impostorRef = useRef<PhysicsImpostor>();
  const scene = useScene();

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

  useLayoutEffect(() => {
    if (material) {
      material.alpha = virtual ? 0.3 : 1;
      material.transparencyMode = virtual ? 2 : 0;
    }
  }, [material, virtual]);

  useEffect(() => {
    if (impostorRef.current) {
      impostorRef.current.setMass(hasGravity ? STONE_MASS : 0);
    }
  }, [impostorRef, hasGravity]);

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
        const mesh = model.meshes[1];
        setMaterial(mesh.material);
        setModelLoaded(true);
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
          ref={impostorRef}
          type={PhysicsImpostor.MeshImpostor}
          _options={{
            mass: hasGravity ? STONE_MASS : 0,
            restitution: 0,
            friction: 1000,
          }}
        />
      )}
      {!item.frozen && (
        <sixDofDragBehavior
          onDragStartObservable={() => {
            setIsGrabbing(true);
            set((store) => {
              store.items[itemId].touched = true;
              store.items[itemId].levitating = false;
            });
          }}
          onDragEndObservable={() => {
            setIsGrabbing(false);
            impostorRef.current?.setMass(hasGravity ? STONE_MASS : 0);
          }}
        />
      )}
    </Model>
  );
}
