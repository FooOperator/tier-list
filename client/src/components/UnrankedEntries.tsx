import { ChangeEvent, useRef } from "react";
import { useStore } from "zustand";
import {
	entryStore,
	useUnrankedEntries,
} from "../store/EntryStore";
import { EntryType } from "../store/EntryStore";
import { SolidButton } from "./Button";
import { Entry } from "./Entry";

export const UnrankedEntries = () => {
	const { addEntry, entries } = useStore(entryStore);
	const fileUploadRef = useRef<HTMLInputElement>(null);
	const unrankedTiers = useUnrankedEntries();

	const triggerFileUpload = () => fileUploadRef.current?.click();
	const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
		const { files } = e.currentTarget;
		console.log("files uploaded:\n", files);
		const filesWithID = [...files!].map((file) => {
			const src = URL.createObjectURL(file);
			return { src } as EntryType;
		});
		addEntry(filesWithID);
	};
	const handleOnDrop = (e: React.DragEvent) => {
		console.log("dataTransfer items: \n", e.dataTransfer.items);
	};

	return (
		<div className="w-2/4 stack-center gap-3" onDrop={handleOnDrop}>
			<div className="text-xl bg-slate-200 px-5 py-10 w-3/4 stack-center rounded-lg">
				<p>
					Drop images or{" "}
					<SolidButton onClick={triggerFileUpload}>
						browse
					</SolidButton>{" "}
				</p>
				<input
					type="file"
					multiple
					accept="image/png, image/jpeg"
					ref={fileUploadRef}
					onChange={handleFileUpload}
					className="hidden"
				/>
			</div>
			<ul className="mt-2 border-2 grid grid-cols-tier gap-y-1 h-96 overflow-y-auto">
				{unrankedTiers.map((entry) => (
					<li className="" key={entry.id}>
						<Entry entry={entry} />
					</li>
				))}
			</ul>
		</div>
	);
};
