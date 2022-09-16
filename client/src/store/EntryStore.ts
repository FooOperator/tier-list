import colors from "tailwindcss/colors";
import create, { useStore } from "zustand";
import { TierData } from "../components/Tier";
import { nanoid } from "nanoid";
import React, { useMemo } from "react";

const testImg = 'https://images.unsplash.com/photo-1532993680872-98b088e2cacd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'

const DEFAULT_TIERS: [TierName, TierColor][] = [
  ["S", colors.slate[600]],
  ["A", colors.orange[600]],
  ["B", colors.red[600]],
  ["C", colors.green[600]],
  ["D", colors.blue[600]],
  [null, colors.amber[100]]
];

export type EntryType = { id: string; src: string; tierName: string | null; };
export type TierName = string | null;
export type TierColor = string;
// TODO: Code methods for operation of many entries/tiers
export type EntryStore = {
  entries: EntryType[];
  tiers: Map<TierName, TierColor>;
  addEntry: (entry: Omit<EntryType, 'id'>[]) => void;
  addTier: (tier: TierData) => void;
  removeEntry: (id: string) => void;
  removeTier: (name: string | null, removeEntries?: boolean) => void;
  editTier: (oldName: string, newTierData: { name: string, color: string }) => void;
  getEntry: (id: string) => EntryType | undefined;
  changeEntryTier: (id: string, tierName: TierName) => void;
  getTiers: () => [TierName, TierColor][];
};

// const convertSetIntoMap = <T, K>(set: Set<T>) => {
//   return new Map<K, T>(set);
// }

// const convertMapIntoSet = <K, T>(map: Map<K, T>) => {
//   return new Set<T>(map);
// }


export const entryStore = create<EntryStore>((set, get) => ({
  tiers: (() => {
    const set = new Set(new Map<TierName, TierColor>(DEFAULT_TIERS))
    return new Map<TierName, TierColor>(set);
  })(),
  entries: [
    { id: nanoid(), src: testImg, tierName: 'S' },
    { id: nanoid(), src: testImg, tierName: null },
    { id: nanoid(), src: testImg, tierName: 'S' },
    { id: nanoid(), src: testImg, tierName: 'A' },
  ],
  addEntry(entry) {
    const validEntries = entry.filter(({ src }) => src);
    const entriesWithIds = validEntries.map(({ tierName, src }) => ({ id: nanoid(), src, tierName })) as EntryType[];
    set((state) => ({ ...state, entries: [...entriesWithIds, ...state.entries] }));
  },
  changeEntryTier(id, tierName) {
    set((state) => {
      const { entries } = state;
      const indexOfTarget = entries.findIndex((entry) => entry.id === id);

      if (indexOfTarget < 0)
        return state;

      const entry = entries.at(indexOfTarget)!;
      const newEntries: EntryType[] = [
        ...entries.slice(0, indexOfTarget),
        { id, src: entry.src, tierName },
        ...entries.slice(indexOfTarget + 1)
      ];
      return {
        ...state,
        entries: newEntries,
      };
    });
  },
  removeEntry(id) {
    set((state) => ({ ...state, entries: state.entries.filter((entry) => entry.id !== id) }));
  },
  removeTier(name, removeEntries) {
    // TODO: Allow removal of tier and preservation of entries (send them to null tier)
    set((state) => {
      if (!removeEntries) {
        const filteredEntries = getFilteredEntries(name);
        // console.log('filtered entries in remove tier -> ', filteredEntries);
        for (const entry of filteredEntries) {
          console.log('entry:\n', entry);
          const { changeEntryTier } = get();
          changeEntryTier(entry.id, null)
        }
      }

      const filteredTiers = [...state.tiers].filter(([curr,]) => curr !== name);
      const map = new Map(filteredTiers);
      console.log('filtered tiers: ', map);

      return {
        ...state,
        tiers: map
      };
    });
  },
  editTier(oldName, newTierData) {
    // !: Not implemented
  },
  addTier(tier) {
    set((state) => ({ ...state, tiers: new Map([...state.tiers, [tier.name, tier.color]]) }));
  },
  getEntry(id) {
    return get().entries.find((entry) => entry.id === id);
  },
  getTiers() {
    const { tiers } = get();
    return [...tiers];
  },
}));

/**
 * @param tierName leave it empty or null for unranked, or match with existing.
 * @returns filtered entries array.
 */

export const getFilteredEntries = (tierName: TierName) => {
  const { entries, tiers } = entryStore.getState();
  if (!tiers.has(tierName)) {
    throw new Error(`${tierName} does not exist in tiers.`);
  }
  const filteredEntries = entries.filter((entry) => entry.tierName === tierName);

  return filteredEntries;
}

export const useFilteredEntries = (tierName: TierName) => {
  const { entries, tiers } = useEntryStore();
  if (!tiers.has(tierName)) {
    throw new Error(`${tierName} does not exist in tiers.`);
  }
  return useMemo(
    () => entries.filter((entry) => entry.tierName === tierName),
    [entries]
  );
}

export const useTierEntriesDict = () => {
  const { getTiers } = useEntryStore();
  const TierEntriesDict: { [key in string]: EntryType[] } = {};
  getTiers().forEach(([tier]) => {
    if (tier) {
      const filteredEntries = useFilteredEntries(tier);
      TierEntriesDict[tier] = filteredEntries;
    } else {
      const unrankedEntries = useUnrankedEntries();
      TierEntriesDict['UNRANKED'] = unrankedEntries;
    }
  });
  return TierEntriesDict;
}

export const useRankedEntries = () => {
  const { entries } = useEntryStore();
  return useMemo(() => entries.filter(({ tierName }) => tierName), [entries]);
}

export const useUnrankedEntries = () => {
  const { entries } = useEntryStore();
  return useMemo(() => entries.filter(({ tierName }) => !tierName), [entries]);
}

export default function useEntryStore() {
  return useStore(entryStore);
}
