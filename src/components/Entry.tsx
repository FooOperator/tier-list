import { EntryType } from "../store";

export const Entry = ({
	entry,
	ghost = false,
}: {
	entry: EntryType;
	ghost?: boolean;
}) => {
	return (
		<img
			className={`entry object-cover w-36 h-36 ${
				ghost ? "opacity-75" : ""
			}`}
			onDragStart={(e) => {
				console.log("dragStart");
				e.dataTransfer.setData("id", entry[0]);
				e.dataTransfer.setData("src", entry[1]);
			}}
			onDragEnd={(e) => {
				console.log("dragEnd");
				e.dataTransfer.clearData("id");
				e.dataTransfer.clearData("src");
			}}
			src={entry[1]}
			id={entry[0]}
			alt=""
		/>
	);
};
