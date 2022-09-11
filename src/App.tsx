import { nanoid } from "nanoid";
import { ChangeEvent, FormEvent, useContext, useState } from "react";
import AppContextProvider, {
	AppContext,
	AppContextProps,
	Entry as EntryType,
} from "./AppContext";
import { ContextMenu, ContextMenuDict } from "./ContextMenu";
import colors from "tailwindcss/colors";
import flatten from "flat";

const flatColors: { [key: string]: string } = flatten(colors);

export const TIER_CONTEXT_OPTIONS: ContextMenuDict = {
	"Delete Tier": () => {},
	"Duplicate Tier": () => {},
	"Insert Tier Below": () => {},
	"Insert Tier Above": () => {},
};
export const ENTRY_CONTEXT_OPTIONS: ContextMenuDict = {
	"Delete Entry": () => {},
	"Duplicate Entry": () => {},
	"Download Image": () => {},
	"Copy Image To Clipboard": () => {},
};

export type Tier = { name: string; color: string };

type TierProps = {
	entries: EntryType[];
	tier: Tier;
};

const Tier = ({ entries, tier }: TierProps) => {
	const { setCurrentOptions } = useContext(
		AppContext
	) as AppContextProps;

	const DetailsBody = () => {
		if (entries.length < 1) {
			return <div className="h-10"></div>;
		}

		return (
			<ul className={`flex`}>
				{entries.map(([id, src]) => (
					<li key={id}>
						<Entry id={id} src={src} />
					</li>
				))}
			</ul>
		);
	};

	return (
		<details
			open
			onContextMenu={() => setCurrentOptions(TIER_CONTEXT_OPTIONS)}
			onDragOver={() => {}}
			className="w-full stack">
			<summary
				style={{ backgroundColor: tier.color }}
				className={`flex justify-around text-xl w-full rounded-sm`}>
				{tier.name}
			</summary>
			<div className="bg-slate-800">
				<DetailsBody />
			</div>
		</details>
	);
};

const TierList = () => {
	const { entries, tiers, addTier } = useContext(
		AppContext
	) as AppContextProps;

	const [newTier, setNewTier] = useState<{
		name: string;
		color: string;
	}>({
		color: "",
		name: "",
	});

	const handleAddTier = (e: FormEvent) => {
		e.preventDefault();
		addTier(newTier);
		setNewTier({ name: "", color: "" });
	};

	return (
		<>
			<div className="relative stack w-2/4">
				<div className="flex justify-around w-full p-3">
					<input
						className="rounded-md text-lg indent-2"
						value={newTier.name}
						onChange={(e) =>
							setNewTier((prev) => ({
								...prev,
								name: e.target.value,
							}))
						}
						type="text"
						form="tier-form"
					/>
					<select
						className="rounded-md"
						style={{ backgroundColor: newTier.color }}
						value={newTier.color}
						onChange={(e) =>
							setNewTier((prev) => ({
								...prev,
								color: e.target.value,
							}))
						}
						form="tier-form">
						{Object.keys(flatColors)
							.slice(3)
							.map((color, index) => {
								const colorValue = flatColors[color];
								return (
									<option
										className="text-xs  text-center uppercase hover:font-bold backdrop-invert "
										style={{
											backgroundColor: colorValue,
										}}
										key={index}
										value={colorValue}>
										{color}
									</option>
								);
							})}
					</select>
				</div>

				{[...tiers].map((tier, index) => {
					if (!tier) return;
					const filtered = entries.filter(
						([, , curr]) => curr?.name === tier.name
					);
					return (
						<Tier key={index} tier={tier} entries={filtered} />
					);
				})}
				<button
					className="bg-blue-300 hover:bg-green-300 rounded-md mt-2"
					form="tier-form">
					+
				</button>
				<form onSubmit={handleAddTier} id="tier-form"></form>
			</div>
		</>
	);
};

const Entry = ({ src, id }: { src: string; id: string }) => {
	const { setCurrentOptions } = useContext(
		AppContext
	) as AppContextProps;

	return (
		<img
			onContextMenu={() => setCurrentOptions(ENTRY_CONTEXT_OPTIONS)}
			className="object-cover  w-36 h-36"
			src={src}
			alt=""
		/>
	);
};

const UnrankedEntries = () => {
	const { addEntry, entries } = useContext(
		AppContext
	) as AppContextProps;
	const [allowDuplicates, setAllowDuplicates] = useState<boolean>();

	const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
		const { files } = e.currentTarget;
		const filesWithID = [...files!].map((file) => {
			const src = URL.createObjectURL(file);
			return [nanoid(), src, undefined] as EntryType;
		});
		addEntry(filesWithID);
	};

	return (
		<div className="stack-center">
			<label
				className={`${
					allowDuplicates ? "bg-blue-400" : ""
				} select-none`}
				htmlFor="allow-duplicates">
				<input
					id="allow-duplicates"
					className="hidden"
					checked={allowDuplicates}
					onChange={(e) => setAllowDuplicates(e.target.checked)}
					type="checkbox"
					name=""
				/>
				Allow duplicates
			</label>
			<p className="text-lg">
				Drop images or{" "}
				<input
					type="file"
					multiple
					accept="image/png, image/jpeg"
					onChange={handleFileUpload}
					className="rounded-md border-2 p-2 border-slate-900 text-slate-900 bg-blue-700"
				/>
			</p>
			<div className="mt-2 grid grid-cols-4 gap-y-1 h-96 overflow-y-auto">
				{entries.map(([id, src, tier], index) => {
					if (!tier) {
						return <Entry key={id} id={id} src={src} />;
					}
				})}
			</div>
		</div>
	);
};

const App = () => {
	return (
		<>
			<AppContextProvider>
				<ContextMenu />
				<div className="h-screen bg-slate-400">
					<header className="flex-center py-5  bg-slate-700">
						<h1 className=" text-4xl">
							<span className="lowercase">tier</span>{" "}
							<span className="uppercase">forge</span>
						</h1>
					</header>
					<main className="h-full">
						<div className="flex mt-20 justify-around">
							<TierList />
							<UnrankedEntries />
						</div>
					</main>
					<footer className=" py-2 bg-slate-700"></footer>
				</div>
			</AppContextProvider>
		</>
	);
};

export default App;
