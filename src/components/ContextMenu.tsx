import { useState, useCallback, useEffect, useContext } from "react";
import { contextMenuStore, entryStore } from "../store";
import { useStore } from "zustand";

type XYPair = {
	x: number;
	y: number;
};

const TIER_OPTIONS: { [key: string]: (e: MouseEvent) => void } = {
	"Remove Tier": (e) => {
		const { id } = e.target as HTMLElement;
		entryStore.getState().removeTier(id);
	},
	"Rename Tier": (e) => {
		const { id } = e.target as HTMLElement;
		// const tier = entryStore
		// 	.getState()
		// 	.getTier();
		// entryStore.getState().renameTier();
	},
};

const ENTRY_OPTIONS: { [key: string]: (e: MouseEvent) => void } = {
	"Remove Entry": (e) => {
		const { id } = e.target as HTMLElement;
		entryStore.getState().removeEntry(id);
	},
	"Duplicate Entry": (e) => {
		console.log("wip");
		// entryStore.getState().duplicateEntry(id);
	},
};

export const useContextMenu = () => {
	const [anchorPoint, setAnchorPoint] = useState<XYPair>({ x: 0, y: 0 });
	const [show, setShow] = useState<boolean>(false);
	const [mouseEvent, setMouseEvent] = useState<MouseEvent | null>(null);
	const { options, setOptions } = useStore(contextMenuStore);

	const handleContextMenu = useCallback(
		(e: MouseEvent) => {
			setMouseEvent(e);

			if (show) {
				closeMenu();
			}

			const { classList } = e.target as HTMLElement;
			const { pageX, pageY } = e;

			let newOptions: ContextMenuDict | null;

			if (classList.contains("tier")) {
				newOptions = TIER_OPTIONS;
			} else if (classList.contains("entry")) {
				newOptions = ENTRY_OPTIONS;
			} else {
				newOptions = null;
			}

			console.log("newOptions -> ", newOptions);

			if (!newOptions) return;

			e.preventDefault();

			setAnchorPoint({ x: pageX, y: pageY });

			setOptions(newOptions);
			setShow(true);
		},
		[setShow, options, setOptions, anchorPoint, setAnchorPoint]
	);

	const closeMenu = () => {
		setShow(false);
		setOptions(null);
	};

	const handleClick = useCallback(() => {
		if (show) {
			closeMenu();
		}
	}, [show, options]);

	const handleKeyDown = useCallback((e: KeyboardEvent) => {
		if (e.key !== "Escape") return;
		closeMenu();
	}, []);

	useEffect(() => {
		console.log("target -> ", mouseEvent);
	}, [mouseEvent]);

	useEffect(() => {
		document.addEventListener("contextmenu", handleContextMenu);
		document.addEventListener("click", handleClick);
		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("contextmenu", handleContextMenu);
			document.removeEventListener("click", handleClick);
			document.removeEventListener("keydown", handleKeyDown);
		};
	});

	return { anchorPoint, show, target: mouseEvent };
};

export type ContextMenuDict = { [name: string]: Function };

export const ContextMenu = () => {
	const { options, setOptions } = useStore(contextMenuStore);

	const { anchorPoint, show, target } = useContextMenu();

	if (show && options) {
		return (
			<div
				className={`absolute z-50 w-48  bg-slate-900 text-slate-200 rounded-md`}
				style={{ top: anchorPoint.y, left: anchorPoint.x }}>
				<ul className="stack">
					{Object.keys(options!).map((name, index) => {
						const fn = options![name];
						return (
							<li
								className="hover:bg-slate-700 border-0 rounded-md first-letter:uppercase  bg-inherit select-none cursor-pointer p-2"
								key={index}
								onClick={() => fn(target)}>
								{name}
							</li>
						);
					})}
				</ul>
			</div>
		);
	}

	return <></>;
};
