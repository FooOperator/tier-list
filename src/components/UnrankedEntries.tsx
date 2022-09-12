import { nanoid } from "nanoid";
import { ChangeEvent, useContext, useState } from "react";
import { useStore } from "zustand";
import { entryStore } from "../store";
import type { EntryType } from "../store";

import { Entry } from "./Entry";

export const UnrankedEntries = () => {
	const { addEntry, entries } = useStore(entryStore);
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
				{entries.map((entry, index) => {
					if (!entry[2]) {
						return <Entry key={entry[0]} entry={entry} />;
					}
				})}
			</div>
		</div>
	);
};
