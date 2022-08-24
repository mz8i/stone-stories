import { PhysicsImpostor } from '@babylonjs/core';
import produce, { setAutoFreeze } from 'immer';
import createStore, { State as ZustandState, StateCreator } from 'zustand';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const immer =
  <T extends ZustandState>(
    config: StateCreator<T, (fn: (state: T) => void) => void>,
  ): StateCreator<T> =>
  (set, get, api) =>
    config((fn) => set(produce(fn) as (state: T) => T), get, api);

setAutoFreeze(false);

export interface PersistentItemState {
  id?: string;
  position: [number, number, number];
  rotation: [number, number, number];
  frozen: boolean;
  model: string;
}
export interface ItemState extends PersistentItemState {
  api?: PhysicsImpostor;
  levitating?: boolean;
  touched?: boolean;
}

export type State = {
  items: Record<string, ItemState>;
  set: (fn: (state: State) => void | State) => void;
};

export const useItemStore = createStore<State>(
  immer((set, get, api) => {
    return {
      items: {} as Record<string, ItemState>,
      set: (fn: (state: State) => State | void) => {
        set(fn);
      },
    };
  }),
);
