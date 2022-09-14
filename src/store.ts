import colors from "tailwindcss/colors";
import { createContext, ReactNode, useEffect, useState } from "react";
import { ContextMenuDict } from "./components/ContextMenu/ContextMenu";
import create from "zustand";
import { TierData } from "./components/Tier";
import { nanoid } from "nanoid";

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

const DEFAULT_TIERS: TierData[] = [
	{ name: "S", color: colors.amber[600] },
	{ name: "A", color: colors.orange[600] },
	{ name: "B", color: colors.yellow[600] },
	{ name: "C", color: colors.green[600] },
	{ name: "D", color: colors.blue[600] },
];

export type EntryType = [id: string, src: string, tier: TierData | undefined];

export type EntryStore = {
	entries: EntryType[];
	tiers: Set<TierData>;
	addEntry: (entry: Omit<EntryType, 'id'>[]) => void;
	addTier: (tier: TierData) => void;
	removeEntry: (id: string) => void;
	removeTier: (name: string) => void;
	renameTier: (oldName: string, newName: string) => void;
	getEntry: (id: string) => EntryType | undefined;
	changeEntryTier: (id: string, tierName: string) => void;
};

export const entryStore = create<EntryStore>((set, get) => ({
	tiers: new Set(DEFAULT_TIERS),
	entries: [],
	addEntry(entry) {
		const entriesWithIds = entry.map((curr) => [nanoid(), curr[1], curr[2]]) as EntryType[];
		const tiersOnly = entriesWithIds.reduce((acc, [, , tier]) => {
			if (tier) {
				acc.unshift(tier);
			}
			return acc;
		}, [] as TierData[]);
		const newTiers = new Set([...get().tiers, ...tiersOnly]);
		set((state) => ({ ...state, entries: [...entriesWithIds, ...state.entries], tiers: newTiers }));
	},
	changeEntryTier(id, tierName) {
		set((state) => {
			const { tiers, entries } = state;
			const indexOfTarget = state.entries.findIndex((entry) => entry[0] === id);

			if (indexOfTarget < 0) return state;

			let newTiers = tiers;

			if ([...tiers].findIndex((curr) => curr.name === tierName) < 0) {
				newTiers = new Set([...get().tiers, { name: tierName, color: colors.amber[100] }]);
			}

			const entry = state.entries.at(indexOfTarget)!;
			const tier = [...state.tiers].find((curr) => curr.name === tierName);
			const newEntries: EntryType[] = [...state.entries.slice(0, indexOfTarget), [id, entry[1], tier], ...state.entries.slice(indexOfTarget + 1)];
			return {
				...state,
				entries: newEntries,
				tiers: newTiers
			}
		});
	},
	removeEntry(id) {
		set((state) => ({ ...state, entries: state.entries.filter((entry) => entry[0] !== id) }));
	},
	removeTier(name) {
		set((state) => ({ ...state, tiers: new Set([...state.tiers].filter((curr) => curr.name !== name)) }))
	},
	renameTier(oldName, newName) {

	},
	addTier(tier) {
		set((state) => ({ ...state, tiers: new Set([...state.tiers, tier]) }))
	},
	getEntry(id) {
		return get().entries.find((entry) => entry[0] === id);
	},
}));