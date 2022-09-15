import { LegacyRef } from "react";
import create, { useStore } from "zustand";

export type ModalKey = 'edit tier' | 'move to tier';
export type ModalOpenClose = { close: () => void; open: () => void; };

export type ModalsStore = {
  modalsRef: Map<ModalKey, ModalOpenClose>;
  registerModal: (key: ModalKey, openClose: ModalOpenClose) => void;
  open: (key: ModalKey) => void;
  close: (key: ModalKey) => void;
};

export const modalsStore = create<ModalsStore>((set) => ({
  modalsRef: new Map(),
  registerModal(ref, openClose) {
    set((state) => {
      const modalsRef = state.modalsRef;

      modalsRef.set(ref, openClose);

      return {
        ...state,
        modalsRef
      }
    })
  },
  open(ref) {
    console.log('key of modal -> ', ref);
    set((state) => {
      const { modalsRef } = state;
      const modal = modalsRef.get(ref);
      modal?.open();
      modalsRef.set(ref, modal!);

      return {
        ...state,
        modalsRef
      }
    });
  },
  close(ref) {
    set((state) => {
      const { modalsRef } = state;
      const modal = modalsRef.get(ref);
      modal?.close();
      modalsRef.set(ref, modal!);

      return {
        ...state,
        modalsRef
      }
    });
  },
}));

export default function useModalsStore() {
  return useStore(modalsStore);
}