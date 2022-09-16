import React, { FormEvent, useEffect, useRef, useState } from "react";
import useEntryStore, {
	EntryType,
	TierColor,
	TierName,
	useTierEntriesDict,
} from "../store/EntryStore";
import { Entry } from "./Entry";
import { Modal, useModal } from "./Modal";
import { ColorSelect } from "./ColorSelect";
import { SubmitButton } from "./Button";
import { applyDatasetToRefs } from "../utils/helpers";
import { flatColors } from "../App";

export type TierData = { name: TierName; color: TierColor };

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
		<Modal modalProps={modalProps}>
			<div className="stack basis">
				<fieldset className="stack mx-8">
					<label htmlFor="">Move From {"S"} to</label>
					<select className="bg-slate-900 " name="" id="">
						{[...getTiers()].map(([name], index) => (
							<option key={index} value={name ?? "unranked"}>
								{name}
							</option>
						))}
					</select>
				</fieldset>
				<div className="flex mt-auto justify-end w-full">
					<SubmitButton form="change-tier">Change</SubmitButton>
				</div>
				<form
					onSubmit={handleSubmit}
					id="change-tier"
					action=""></form>
			</div>
		</Modal>
	);
};

export const EditTierModal = () => {
	const modalProps = useModal("edit tier");
	const { getTiers } = useEntryStore();
	const [newTierData, setNewTierData] = useState<TierData>({
		name: "",
		color: "",
	});

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		setNewTierData({ name: "", color: "" });
		modalProps.close();
	};

	return (
		<Modal modalProps={modalProps}>
			<div className="stack h-full">
				<div className="flex my-auto text-lg justify-around gap-5 w-full">
					<fieldset className="stack basis-full">
						<label htmlFor="">Name</label>
						<input
							className="bg-slate-900 indent-4 rounded-md"
							placeholder="Old Tier Name"
							value={newTierData.name as string}
							onChange={(e) =>
								setNewTierData((prev) => ({
									...prev,
									name: e.target.value,
								}))
							}
							form="edit-tier"
							type="text"
						/>
					</fieldset>
					<fieldset className="stack basis-full">
						<label htmlFor="">Color</label>
						<select className="bg-slate-900 " name="" id="">
							{Object.keys(flatColors).map((key, index) => {
								const color = flatColors[key];
								return(
								<option
									key={index}
									value={color ?? "unranked"}>
									{color}
								</option>
							)})}
						</select>
					</fieldset>
				</div>
				<div className="flex mt-auto justify-end w-full">
					<SubmitButton form="edit-tier">Change</SubmitButton>
				</div>
				<form
					onSubmit={handleSubmit}
					id="edit-tier"
					action=""></form>
			</div>
		</Modal>
	);
};

type TierProps = {
	entries: EntryType[];
	tierData: TierData;
	open?: boolean;
};

export const Tier = ({ entries, tierData, open }: TierProps) => {
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
			name: tierData.name as string,
			color: tierData.color,
		};

		const refs = [ulRef, summaryRef, detailsRef, spanRef];

		applyDatasetToRefs(dataset, refs);
	});

	const DetailsBody = () => (
		<ul
			ref={ulRef}
			style={{
				borderColor: tierData.color,
			}}
			data-context="tier"
			className={`bg-slate-800 border-x-4 border-b-4 grid grid-cols-tier  ${
				entries.length < 1 ? "h-36" : ""
			}`}>
			{entries.map((entry) => (
				<li className="h-36" key={entry.id}>
					<Entry entry={entry} />
				</li>
			))}
		</ul>
	);

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
				changeEntryTier(id, tierData.name);
			}}
			onDragOver={(e) => {
				e.preventDefault();
				console.log("hi from drag over");
			}}>
			<summary
				ref={summaryRef}
				style={{
					backgroundColor: tierData.color,
				}}
				data-context="tier"
				className={`tier flex justify-center text-lg cursor-pointer hover:brightness-150 hover:font-bold w-full`}>
				<span ref={spanRef}>{tierData.name}</span>
			</summary>
			<DetailsBody />
		</details>
	);
};

type AddTierFormProps = {
	setNewTier: (value: React.SetStateAction<TierData>) => void;
	newTier: TierData;
};

const AddTierForm = ({ setNewTier, newTier }: AddTierFormProps) => {
	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNewTier((prev) => ({
			...prev,
			name: e.target.value,
		}));
	};

	const handleColorChange = (
		e: React.ChangeEvent<HTMLSelectElement>
	) => {
		setNewTier((prev) => ({
			...prev,
			color: e.target.value,
		}));
	};

	return (
		<div className="flex items-center gap-4 w-full p-3">
			<input
				className="rounded-md text-lg indent-2 basis-2/4 py-1"
				value={newTier.name as string}
				onChange={handleNameChange}
				form="new-tier"
			/>
			<SubmitButton
				form="new-tier"
				disabled={newTier.name!.length < 1}>
				Add
			</SubmitButton>
			<div className="ml-auto basis-1/4">
				<ColorSelect
					color={newTier.color}
					setColor={handleColorChange}
				/>
			</div>
		</div>
	);
};

export const TierList = () => {
	const [newTier, setNewTier] = useState<TierData>({
		color: "",
		name: "",
	});

	const tiersEntriesDict = useTierEntriesDict();
	const { addTier, tiers } = useEntryStore();
	const getTier = (key: TierName) => ({
		name: key,
		color: tiers.get(key)!,
	});

	const handleAddTier = (e: FormEvent) => {
		e.preventDefault();
		addTier(newTier);
		setNewTier({ name: "", color: "" });
	};

	return (
		<>
			<EditTierModal />
			<ChangeTierModal />
			<div className="stack basis-full gap-4">
				<AddTierForm newTier={newTier} setNewTier={setNewTier} />
				<ul className="w-full px-3  overflow-y-auto">
					{Object.keys(tiersEntriesDict)
						.filter((name) => name !== "UNRANKED")
						.map((key) => {
							const entries = tiersEntriesDict[key];
							const tierData: TierData = getTier(key);
							return (
								<li key={key}>
									<Tier
										open
										entries={entries}
										tierData={tierData}
									/>
								</li>
							);
						})}
				</ul>
				<form onSubmit={handleAddTier} id="new-tier"></form>
			</div>
		</>
	);
};
