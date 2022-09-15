import { entryStore } from "../../store/EntryStore";
import { ContextMenuDict } from "./ContextMenu";

export const ENTRY_OPTIONS: ContextMenuDict = {
	"Remove Entry": (e) => {
		const { dataset } = e.target as HTMLElement;
		const id = dataset['id']!;
		entryStore.getState().removeEntry(id);
	},
	"Download Image As PNG": (e) => {
		const { dataset } = e.target as HTMLImageElement;
		const src = dataset['src']!;
		downloadImage(src, "png");
	},
	"Download Image As JPEG": (e) => {
		const { dataset } = e.target as HTMLImageElement;
		const src = dataset['src']!;
		downloadImage(src);
	},
};

const downloadImage = (src: string, format: "png" | "jpeg" = "jpeg") => {
	const blob = new Blob([src], { type: format });
	const urlObject = URL.createObjectURL(blob);
	const temporaryAnchor = document.createElement("a");
	temporaryAnchor.href = src;
	temporaryAnchor.download = urlObject + "." + blob.type;
	temporaryAnchor.click();
	window.URL.revokeObjectURL(urlObject);
};