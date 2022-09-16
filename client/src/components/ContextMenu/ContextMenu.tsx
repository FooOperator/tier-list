import { useState, useCallback, useEffect } from "react";
import useContextMenuStore from "../../store/ContextMenuStore";
import { ENTRY_OPTIONS } from "./ENTRY_OPTIONS";
import { TIER_OPTIONS } from "./TIER_OPTIONS";

type XYPair = {
	x: number;
	y: number;
};

const options_map: Map<string, ContextMenuDict> = new Map<
	string,
	ContextMenuDict
>([
	["tier", TIER_OPTIONS],
	["entry", ENTRY_OPTIONS],
]);

export const useContextMenu = () => {
	const [anchorPoint, setAnchorPoint] = useState<XYPair>({ x: 0, y: 0 });
	const [show, setShow] = useState<boolean>(false);
	const [mouseEvent, setMouseEvent] = useState<MouseEvent | null>(null);
	const { options, setOptions } = useContextMenuStore();

	const handleContextMenu = useCallback(
		(e: MouseEvent) => {
			setMouseEvent(e);

			if (show) {
				closeMenu();
			}

			const { dataset } = e.target as HTMLElement;
			const { pageX, pageY } = e;

			let newOptions: ContextMenuDict | null;

			const contextData = dataset.context;

			if (!contextData) return;

			e.preventDefault();

			setAnchorPoint({ x: pageX, y: pageY });
			newOptions = options_map.get(contextData) ?? null;
			if (options_map.has(contextData)) {
				setOptions(newOptions);
			}
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

export type ContextMenuDict<A = void, R = void> = {
	[name: string]: (e: MouseEvent, args?: A) => R;
};

export const ContextMenu = () => {
	const { options, setOptions } = useContextMenuStore();

	const { anchorPoint, show, target } = useContextMenu();

	if (show && options) {
		return (
			<div
				className={`absolute z-50 w-64 bg-slate-900 text-slate-200 rounded-md`}
				style={{ top: anchorPoint.y, left: anchorPoint.x }}>
				<ul className="stack">
					{Object.keys(options!).map((name, index) => {
						const fn = options![name];
						return (
							<li
								className="hover:bg-slate-700 border-0 rounded-md first-letter:uppercase bg-inherit select-none cursor-pointer p-2"
								key={index}
								onClick={() => fn(target!)}>
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
