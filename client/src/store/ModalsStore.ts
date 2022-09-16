import { LegacyRef } from "react";
import create, { useStore } from "zustand";

export type ModalKey = 'edit tier' | 'move to tier';
export type ModalOpenClose = { close: () => void; open: () => void; };

export type ModalsStore = {
  modals: Map<ModalKey, ModalOpenClose>;
  registerModal: (key: ModalKey, openClose: ModalOpenClose) => void;
  open: (key: ModalKey) => void;
  close: (key: ModalKey) => void;
};

export const modalsStore = create<ModalsStore>((set) => ({
  modals: new Map(),
  registerModal(ref, openClose) {
    set((state) => {
      const modals = state.modals;

      modals.set(ref, openClose);

      return {
        ...state,
        modals
      }
    })
  },
  open(ref) {
    console.log('key of modal -> ', ref);
    set((state) => {
      const { modals } = state;
      const modal = modals.get(ref);
      
      for (const modal of modals) {
        modal[1].close();
      }
      
      modal?.open();
      modals.set(ref, modal!);

      return {
        ...state,
        modals
      }
    });
  },
  close(ref) {
    set((state) => {
      const { modals } = state;
      const modal = modals.get(ref);
      modal?.close();
      modals.set(ref, modal!);

      return {
        ...state,
        modals
      }
    });
  },
}));

export default function useModalsStore() {
  return useStore(modalsStore);
}