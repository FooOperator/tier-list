import { FormEvent, useContext, useState } from "react";
import { entryStore, EntryType } from "../store";
import { useStore } from "zustand";
import { Entry } from "./Entry";
import { flatColors } from "../App";
import { Modal, useModal } from "./Modal";

export type TierData = { name: string; color: string };

type TierProps = {
	entries: EntryType[];
	tier: TierData;
};

export const RenameTierModal = () => {
	const renameModalProps = useModal();
	const [newTierName, setNewTierName] = useState<string>("");

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		renameModalProps.close();
	};

	return (
		<>
			<Modal modalProps={renameModalProps}>
				<input
					className="w-full text-lg my-auto indent-4 rounded-md"
					placeholder="Old Tier Name"
					value={newTierName}
					onChange={(e) => setNewTierName(e.target.value)}
					form="rename-form"
					type="text"
				/>
				<button
					form="rename-form"
					className="rounded-md p-1 ml-auto text-slate-50 bg-blue-600 mt-3">
					Change
				</button>
				<form
					onSubmit={handleSubmit}
					id="rename-form"
					action=""></form>
			</Modal>
		</>
	);
};

export const Tier = ({ entries, tier }: TierProps) => {
	const [droppableAvailable, setDroppableAvailable] =
		useState<boolean>(false);
	const [droppableSrc, setDroppableSrc] = useState<string | null>(null);
	const { changeEntryTier } = useStore(entryStore);
	const DetailsBody = () => {
		if (entries.length < 1) {
			return <div className="h-10"></div>;
		}

		return (
			<ul className={`flex`}>
				{entries.map((entry) => (
					<li key={entry[0]}>
						<Entry entry={entry} />
					</li>
				))}
			</ul>
		);
	};

	return (
		<details
			open
			onDragEnter={(e) => {
				const { dataTransfer } = e;
				console.log(e.currentTarget);
				console.log(
					"e.dataTransfer.id -> ",
					dataTransfer.getData("id")
				);
				setDroppableAvailable(true);
				setDroppableSrc(e.dataTransfer.getData("src"));
			}}
			onDragLeave={() => {
				console.log("droppable has left");
				setDroppableAvailable(true);
				setDroppableSrc(null);
			}}
			onDrop={(e) => {
				console.log("drop");
				const id = e.dataTransfer.getData("id");
				changeEntryTier(id, tier.name);
			}}
			onDragOver={(e) => {
				e.preventDefault();
				console.log("hi from drag over");
			}}
			className="w-full stack">
			<summary
				id={tier.name}
				style={{ backgroundColor: tier.color }}
				className={`tier flex justify-around cursor-pointer text-xl select-none hover:brightness-150 w-full rounded-sm`}>
				{tier.name}
			</summary>
			<div className="bg-slate-800">
				<DetailsBody />
				{droppableAvailable && droppableSrc && (
					<li>
						<Entry
							entry={["temp", droppableSrc, undefined]}
							ghost
						/>
					</li>
				)}
			</div>
		</details>
	);
};

export const TierList = () => {
	const { addTier, tiers, entries } = useStore(entryStore);

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
			<RenameTierModal />
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
						<Tier
							key={tier.name}
							tier={tier}
							entries={filtered}
						/>
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
