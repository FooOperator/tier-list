import { createContext, ReactNode, useEffect, useState } from "react";
import { ContextMenuDict } from "./ContextMenu";
import colors from "tailwindcss/colors";
import { Tier } from "./App";

const DEFAULT_TIERS: Tier[] = [
	{ name: "S", color: colors.amber[100] },
	{ name: "A", color: colors.orange[600] },
	{ name: "B", color: colors.yellow[600] },
	{ name: "C", color: colors.green[600] },
	{ name: "D", color: colors.blue[600] },
];

export type Entry = [id: string, src: string, tier: Tier | undefined];

export type AppContextProps = {
	currentOptions: ContextMenuDict | undefined;
	setCurrentOptions: (options: ContextMenuDict) => void;
	entries: Entry[];
	tiers: Set<Tier>;
	addEntry: (entry: Entry[]) => void;
	addTier: (tier: Tier) => void;
	removeEntry: (id: string) => void;
	removeTier: (name: string) => void;
	getEntry: (id: string) => Entry | undefined;
	changeEntryTier: (id: string, tier: string) => void;
};

export const AppContext = createContext<AppContextProps | null>(null);

const AppContextProvider = ({ children }: { children: ReactNode }) => {
	const [currentOptions, setCurrentOptions] =
		useState<ContextMenuDict>();
	const [entries, setEntries] = useState<Entry[]>([]);
	const [tiers, setTiers] = useState<Set<Tier>>(new Set(DEFAULT_TIERS));

	useEffect(() => {
		console.log("set: ", tiers);
	});

	const addEntry = (entry: Entry[]) => {
		setEntries((prev) => [...entry, ...prev]);

		setTiers((prev) => {
			const tiersOnly = entry.reduce((acc, [, , tier]) => {
				if (tier) {
					acc.unshift(tier);
				}
				return acc;
			}, [] as Tier[]);
			return new Set([...prev, ...tiersOnly]);
		});
	};

	const removeEntry = (id: string) => {
		setEntries((prev) => prev.filter((entry) => entry[0] !== id));
	};

	const removeTier = (name: string) => {
		setTiers((prev) => {
			const newSet = prev;
			const toDelete = [...newSet].find(
				(tier) => tier.name === name
			);
			if (toDelete) {
				newSet.delete(toDelete);
			}
			return newSet;
		});
	};

	const addTier = (tier: Tier) => {
		alert(`new tier: ${tier}`);
		setTiers((prev) => {
			const newSet = prev;
			newSet.add(tier);
			return newSet;
		});
	};

	const getEntry = (id: string): Entry | undefined => {
		return entries.find((entry) => entry[0] === id);
	};

	const changeEntryTier = (id: string, name: string) => {
		const indexOfTarget = entries.findIndex(
			(entry) => entry[0] === id
		);
		const [src] = entries.at(indexOfTarget)!;

		if ([...tiers].findIndex((curr) => curr.name === name) === -1) {
			setTiers(
				(prev) =>
					new Set([...prev, { name, color: colors.amber[100] }])
			);
		}

		setEntries((prev) => [
			...prev.slice(0, indexOfTarget),
			[id, src, { name: "", color: "" }],
			...prev.slice(indexOfTarget + 1),
		]);
	};

	return (
		<AppContext.Provider
			value={{
				currentOptions,
				setCurrentOptions,
				entries,
				tiers,
				addEntry,
				addTier,
				removeEntry,
				removeTier,
				getEntry,
				changeEntryTier,
			}}>
			{children}
		</AppContext.Provider>
	);
};

export default AppContextProvider;
