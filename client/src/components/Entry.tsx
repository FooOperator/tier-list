import { useEffect, useRef } from "react";
import { EntryType } from "../store/EntryStore";
import { applyDatasetToRefs } from "../utils/helpers";

export const Entry = ({
	entry,
	ghost = false,
	caption,
}: {
	entry: EntryType;
	ghost?: boolean;
	caption?: string;
}) => {
	const imgRef = useRef<HTMLImageElement>(null);
	const figureRef = useRef(null);
	const figcaptionRef = useRef(null);

	useEffect(() => {
		const dataset: { [key: string]: string } = {
			context: "entry",
			id: entry.id,
			src: entry.src,
		};

		const refs = [imgRef, figureRef, figcaptionRef];

		applyDatasetToRefs(dataset, refs);
	});

	const handleOnDragStart = (e: React.DragEvent) => {
		console.log("dragStart");
		e.dataTransfer.setData("id", entry.id);
		e.dataTransfer.setData("src", entry.src);
	};

	const handleOnDragEnd = (e: React.DragEvent) => {
		console.log("dragEnd");
		e.dataTransfer.clearData("id");
		e.dataTransfer.clearData("src");
	};

	return (
		<figure
			onDragStart={handleOnDragStart}
			onDragEnd={handleOnDragEnd}
			ref={figureRef}
			id={entry.id}
			draggable
			className="stack-center cursor-grab h-full w-full border-4 bg-white hover:border-red-300 hover:bg-red-300">
			<img
				className={`basis-5/6 ${ghost ? "opacity-75" : ""}`}
				ref={imgRef}
				src={entry.src}
				alt={entry.src}
			/>
			<figcaption
				className="basis-1/6 font-medium p-2 w-full text-center text-ellipsis overflow-hidden"
				ref={figcaptionRef}>
				{caption ?? "UNTITLED"}
			</figcaption>
		</figure>
	);
};
