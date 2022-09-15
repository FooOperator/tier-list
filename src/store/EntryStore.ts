import colors from "tailwindcss/colors";
import create, { useStore } from "zustand";
import { TierData } from "../components/Tier";
import { nanoid } from "nanoid";

const testImg = 'https://images.unsplash.com/photo-1532993680872-98b088e2cacd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'

const DEFAULT_TIERS: TierData[] = [
  { name: "S", color: colors.slate[600] },
  { name: "A", color: colors.orange[600] },
  { name: "B", color: colors.red[600] },
  { name: "C", color: colors.green[600] },
  { name: "D", color: colors.blue[600] },
];

export type EntryType = { id: string; src: string; tierName: string | null; };

// TODO: Code methods for operation of many entries/tiers
export type EntryStore = {
  entries: EntryType[];
  tiers: Set<TierData>;
  addEntry: (entry: Omit<EntryType, 'id'>[]) => void;
  addTier: (tier: TierData) => void;
  removeEntry: (id: string) => void;
  removeTier: (name: string | null, removeEntries?: boolean) => void;
  renameTier: (oldName: string, newName: string) => void;
  getEntry: (id: string) => EntryType | undefined;
  changeEntryTier: (id: string, tierName: string) => void;
  getTiers: () => ReadonlyArray<TierData>;
};

export const entryStore = create<EntryStore>((set, get) => ({
  tiers: new Set(DEFAULT_TIERS),
  entries: [
    { id: nanoid(), src: testImg, tierName: 'S' },
    { id: nanoid(), src: testImg, tierName: null },
    { id: nanoid(), src: testImg, tierName: 'S' },
    { id: nanoid(), src: testImg, tierName: 'S' },
  ],
  addEntry(entry) {
    const validEntries = entry.filter(({ src }) => src);
    const entriesWithIds = validEntries.map(({ tierName, src }) => ({ id: nanoid(), src, tierName })) as EntryType[];
    const tiersOnly = entriesWithIds.reduce((acc, { tierName }) => {
      if (tierName) {
        acc.unshift(tierName);
      }
      return acc;
    }, [] as string[]);
    const newTiers = new Set([...get().tiers, ...tiersOnly]);
    set((state) => ({ ...state, entries: [...entriesWithIds, ...state.entries] }));
  },
  changeEntryTier(id, tierName) {
    set((state) => {
      const { tiers, entries } = state;
      const indexOfTarget = state.entries.findIndex((entry) => entry.id === id);

      if (indexOfTarget < 0)
        return state;

      let newTiers = tiers;

      if ([...tiers].findIndex((curr) => curr.name === tierName) < 0) {
        newTiers = new Set([...get().tiers, { name: tierName, color: colors.amber[100] }]);
      }

      const entry = state.entries.at(indexOfTarget)!;
      const tier = [...state.tiers].find((curr) => curr.name === tierName);
      const newEntries: EntryType[] = [...state.entries.slice(0, indexOfTarget), { id, src: entry.src, tierName: tier!.name }, ...state.entries.slice(indexOfTarget + 1)];
      return {
        ...state,
        entries: newEntries,
        tiers: newTiers
      };
    });
  },
  removeEntry(id) {
    set((state) => ({ ...state, entries: state.entries.filter((entry) => entry.id !== id) }));
  },
  removeTier(name, removeEntries) {
    // TODO: Allow removal of tier and preservation of entries (send them to null tier)
    set((state) => ({ ...state, tiers: new Set([...state.tiers].filter((curr) => curr.name !== name)) }));
  },
  renameTier(oldName, newName) {
    // !: Not implemented
  },
  addTier(tier) {
    set((state) => ({ ...state, tiers: new Set([...state.tiers, tier]) }));
  },
  getEntry(id) {
    return get().entries.find((entry) => entry.id === id);
  },
  getTiers() {
    const {tiers} = get();
    return [...tiers] as ReadonlyArray<TierData>;
  },
}));

export default function useEntryStore() {
  return useStore(entryStore);
}
