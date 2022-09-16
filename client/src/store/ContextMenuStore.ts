import { ContextMenuDict } from "../components/ContextMenu/ContextMenu";
import create, { useStore } from "zustand";


export type ContextMenuProps = {
	options: ContextMenuDict | null;
	setOptions: (options: ContextMenuDict | null) => void;
};

export const contextMenuStore = create<ContextMenuProps>((set) => ({
	options: null,
	setOptions(options) {
		set((state) => ({ ...state, options }));
	},
}));

export default function useContextMenuStore() {
	return useStore(contextMenuStore);
}
