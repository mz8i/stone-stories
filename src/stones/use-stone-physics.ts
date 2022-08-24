import { useEffect } from 'react';
import { useItemStore } from '../item-store';
import { stoneMetadata } from './StoneModel';

export const STONE_MASS = 50;

export function useStonePhysics(itemId) {
  const set = useItemStore((store) => store.set);
  const item = useItemStore((store) => store.items[itemId]);

  /*
  const [ref, api] = useBox(
    () => {
      const options: any = {
        args: stoneMetadata[item.model].physicsBox,
        position: item.position,
        rotation: item.rotation,
      };

      if (!item.frozen && !item.levitating) {
        options.mass = STONE_MASS;
        options.sleepSpeedLimit = 0.5;
      }

      return options;
    },
    null,
    [item.frozen, item.levitating],
  );

  useEffect(() => {
    if (!api) return;

    set((store) => {
      store.items[itemId].api = api;
    });
  }, [api, itemId, set]);

  useEffect(() => {
    return api?.position.subscribe((position) => {
      set((store) => {
        if (store.items[itemId]) {
          store.items[itemId].position = position;
        }
      });
    });
  }, [api, itemId, set]);

  useEffect(() => {
    return api?.rotation.subscribe((r) => {
      set((store) => {
        if (store.items[itemId]) {
          store.items[itemId].rotation = r;
        }
      });
    });
  }, [api, itemId, set]);

  return [ref, api] as const;
  */
}
