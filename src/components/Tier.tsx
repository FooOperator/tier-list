import { FormEvent, useEffect, useRef, useState } from "react";
import useEntryStore, { EntryType } from "../store/EntryStore";
import { Entry } from "./Entry";
import { Modal, useModal } from "./Modal";
import { ColorSelect } from "./ColorSelect";
import { SubmitButton } from "./Button";
import { applyDatasetToRefs } from "../utils/helpers";

export type TierData = { name: string; color: string };

export const EditTierModal = () => {
	const modalProps = useModal("edit tier");
	const [newTierData, setNewTierData] = useState<TierData>({
		name: "",
		color: "",
	});

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		modalProps.close();
	};

	return (
		<>
			<Modal modalProps={modalProps}>
				<input
					className="w-full text-lg my-auto indent-4 rounded-md"
					placeholder="Old Tier Name"
					value={newTierData.name}
					onChange={(e) =>
						setNewTierData((prev) => ({
							...prev,
							name: e.target.value,
						}))
					}
					form="rename-form"
					type="text"
				/>
				<ColorSelect
					color={newTierData.color}
					setColor={(e) =>
						setNewTierData((prev) => ({
							...prev,
							color: e.target.value,
						}))
					}
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

export const ChangeTierModal = () => {
	const modalProps = useModal("move to tier");
	const { getTiers } = useEntryStore();
	const [newTierData, setNewTierData] = useState<TierData>({
		name: "",
		color: "",
	});

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		modalProps.close();
	};

	return (
		<>
			<Modal modalProps={modalProps}>
				<input
					className="w-full text-lg my-auto indent-4 rounded-md"
					placeholder="Old Tier Name"
					value={newTierData.name}
					onChange={(e) =>
						setNewTierData((prev) => ({
							...prev,
							name: e.target.value,
						}))
					}
					form="rename-form"
					type="text"
				/>
				<select name="" id="">
					{getTiers().map((tier, index) => (
						<option key={index} value={tier.name}>
							{tier.name}
						</option>
					))}
				</select>
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

type TierProps = {
	entries: EntryType[];
	tier: TierData;
	open?: boolean;
};

export const Tier = ({ entries, tier, open }: TierProps) => {
	const [droppableAvailable, setDroppableAvailable] =
		useState<boolean>(false);
	const [droppableSrc, setDroppableSrc] = useState<string | null>(null);
	const { changeEntryTier } = useEntryStore();
	const ulRef = useRef(null);
	const summaryRef = useRef(null);
	const detailsRef = useRef(null);
	const spanRef = useRef(null);

	useEffect(() => {
		const dataset: { [key: string]: string } = {
			context: "tier",
			name: tier.name,
			color: tier.color,
		};

		const refs = [ulRef, summaryRef, detailsRef, spanRef];

		applyDatasetToRefs(dataset, refs);
	});

	const collapse = () => {};

	const expand = () => {};

	const DetailsBody = () => {
		return (
			<ul
				ref={ulRef}
				style={{
					borderColor: tier.color,
				}}
				data-context="tier"
				className={`bg-slate-800 border-x-4 border-b-4 grid grid-cols-tier  ${
					entries.length < 1 ? "h-36" : ""
				}`}>
				{entries.map((entry, index) => (
					<li className="h-36" key={entry.id}>
						<Entry entry={entry} />
					</li>
				))}
			</ul>
		);
	};

	return (
		<details
			open={open}
			ref={detailsRef}
			className="w-full stack"
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
			}}>
			<summary
				ref={summaryRef}
				style={{
					backgroundColor: tier.color,
				}}
				data-context="tier"
				className={`tier flex justify-center text-lg cursor-pointer hover:brightness-150 hover:font-bold w-full`}>
				<span ref={spanRef}>{tier.name}</span>
			</summary>
			<DetailsBody />
			{/* {droppableAvailable && droppableSrc && (
				<li>
					<Entry
						entry={["temp", droppableSrc, undefined]}
						ghost
					/>
				</li>
			)} */}
		</details>
	);
};

type AddTierFormProps = {
	setNewTier: (value: React.SetStateAction<TierData>) => void;
	newTier: TierData;
};

const AddTierForm = ({ setNewTier, newTier }: AddTierFormProps) => {
	return (
		<div className="flex items-center gap-4 w-full p-3">
			<input
				className="rounded-md text-lg indent-2 basis-2/4 py-1"
				value={newTier.name}
				onChange={(e) =>
					setNewTier((prev) => ({
						...prev,
						name: e.target.value,
					}))
				}
				form="new-tier"
			/>
			<SubmitButton
				form="new-tier"
				disabled={newTier.name.length < 1}>
				Add
			</SubmitButton>
			<div className="ml-auto basis-1/4">
				<ColorSelect
					color={newTier.color}
					setColor={(e) =>
						setNewTier((prev) => ({
							...prev,
							color: e.target.value,
						}))
					}
				/>
			</div>
		</div>
	);
};

export const TierList = () => {
	const [allowMultiple, setAllowMultiple] = useState<boolean>(true);
	const [newTier, setNewTier] = useState<TierData>({
		color: "",
		name: "",
	});
	const { addTier, tiers, entries } = useEntryStore();

	const handleAddTier = (e: FormEvent) => {
		e.preventDefault();
		addTier(newTier);
		setNewTier({ name: "", color: "" });
	};

	// const toggleAllowMultiple = () => {
	// 	console.log("set multiple toggle");
	// 	setAllowMultiple((prev) => !prev);
	// };

	return (
		<>
			<EditTierModal />
			<ChangeTierModal />
			<div className="stack basis-full gap-4">
				<AddTierForm newTier={newTier} setNewTier={setNewTier} />
				<ul className="w-full px-3  overflow-y-auto">
					{[...tiers].map((tier, index) => {
						if (!tier) return;
						const filtered = entries.filter(
							({ tierName }) => tierName === tier.name
						);
						return (
							<li key={tier.name}>
								<Tier tier={tier} entries={filtered} />
							</li>
						);
					})}
				</ul>

				<form onSubmit={handleAddTier} id="new-tier"></form>
			</div>
		</>
	);
};

// Button group

{
	/* <div className="button-group flex justify-center gap-2">
	<SolidButton>Collapse All</SolidButton>
	<GhostButton>Fold All</GhostButton>
	<Toggle toggle={toggleAllowMultiple} on={allowMultiple}>
		Allow Multiple
	</Toggle>
</div>; */
}
