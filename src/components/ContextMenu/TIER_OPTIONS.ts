import { entryStore } from "../../store/EntryStore";
import { modalsStore } from "../../store/ModalsStore";
import { ContextMenuDict } from "./ContextMenu";

export const TIER_OPTIONS: ContextMenuDict = {
	"Edit Tier": (e) => {
		modalsStore.getState().open('edit tier');
	},
	"Remove Tier": (e) => {
		const { dataset } = e.target as HTMLElement;
		const name = dataset['name']!;
		entryStore.getState().removeTier(name);
	},
	"Remove Tier And Entries": (e) => {
		const { dataset } = e.target as HTMLElement;
		const name = dataset['name']!;
		entryStore.getState().removeTier(name, true);
	},
	"Move Entries To Tier (WIP)": (e) => {
		const { dataset } = e.target as HTMLElement;
		const name = dataset['name']!;
		modalsStore.getState().open('move to tier');

	}
};
