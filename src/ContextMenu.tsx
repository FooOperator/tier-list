import { useState, useCallback, useEffect, useContext } from "react";
import { AppContext, AppContextProps } from "./AppContext";

type XYPair = {
	x: number;
	y: number;
};

export const useContextMenu = () => {
	const [anchorPoint, setAnchorPoint] = useState<XYPair>({ x: 0, y: 0 });
	const [show, setShow] = useState<boolean>(false);

	const handleContextMenu = useCallback(
		(e: MouseEvent) => {
			e.preventDefault();
			const { pageX, pageY } = e;
			setAnchorPoint({ x: pageX, y: pageY });
			setShow(true);
		},
		[setAnchorPoint, setShow]
	);

	const handleClick = useCallback(
		() => (show ? setShow(false) : null),
		[show]
	);

	useEffect(() => {
		document.addEventListener("contextmenu", handleContextMenu);
		document.addEventListener("click", handleClick);

		return () => {
			document.removeEventListener("contextmenu", handleContextMenu);
			document.removeEventListener("click", handleClick);
		};
	});

	return { anchorPoint, show };
};

export type ContextMenuDict = { [name: string]: Function };

export const ContextMenu = () => {
	const { currentOptions } = useContext(AppContext) as AppContextProps;

	const { anchorPoint, show } = useContextMenu();
	if (show) {
		return (
			<div
				className={`absolute z-50  bg-slate-900 text-slate-200 rounded-md`}
				style={{ top: anchorPoint.y, left: anchorPoint.x }}>
				<ul className="stack">
					{Object.keys(currentOptions!).map((name, index) => {
						const fn = currentOptions![name];
						return (
							<li
								className="hover:bg-slate-700 border-0 rounded-md  bg-inherit select-none cursor-pointer p-2"
								key={index}
								onClick={() => fn()}>
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
