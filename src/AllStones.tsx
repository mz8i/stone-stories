import { Suspense, useEffect } from 'react';
import { Floor } from './Floor';
import { ItemState, useItemStore } from './item-store';
import { Stone } from './stones/Stone';
import { getStones } from './firebase';

function useInitStones() {
  const set = useItemStore((store) => store.set);
  //TODO
  /*
  useEffect(() => {
    if (!set) return;
    async function load() {
      const items = await getStones();
      for (const item of items) {
        set((store) => {
          const current = store.items[item.id];
          store.items[item.id] = Object.assign(
            {},
            current ?? {},
            item,
            { frozen: (current?.frozen ?? true) && item.frozen }, // only apply frozen for external items
          );
        });
      }
    }
    load();
  }, [set]);
  */
}

const NEW_STONE_HEIGHT = 1.2;

function useInitNewStones() {
  const set = useItemStore((store) => store.set);

  useEffect(() => {
    if (!set) return;
    const newStones: ItemState[] = [
      {
        id: '_1',
        model: 'rock-irregular',
        position: [-0.5, NEW_STONE_HEIGHT, -1],
        rotation: [0, 0, 0],
        levitating: true,
        frozen: false,
      },
      {
        id: '_2',
        model: 'rock-big',
        position: [-1, NEW_STONE_HEIGHT, -1],
        rotation: [0, 0, 0],
        levitating: true,
        frozen: false,
      },
      {
        id: '_3',
        model: 'rock-gray',
        position: [0.2, NEW_STONE_HEIGHT, -1],
        rotation: [0, 0, 0],
        levitating: true,
        frozen: false,
      },
      {
        id: '_4',
        model: 'rock-black',
        position: [1, NEW_STONE_HEIGHT, -1],
        rotation: [0, 0, 0],
        levitating: true,
        frozen: false,
      },
    ];

    newStones.forEach((item) => {
      set((store) => {
        store.items[item.id] = item;
      });
    });
  }, [set]);
}

export function AllStones() {
  useInitStones();
  useInitNewStones();

  const itemIds = useItemStore((store) => Object.keys(store.items));
  return (
    <Suspense fallback={null}>
      {itemIds.map((itemId) => (
        <Stone key={itemId} itemId={itemId} />
      ))}
    </Suspense>
  );
}
