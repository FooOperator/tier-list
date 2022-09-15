import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import React, {
	LegacyRef,
	ReactNode,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import useModalsStore, { ModalKey } from "../store/ModalsStore";

const safeDocument: Document | {} =
	typeof document !== "undefined" ? document : {};

// TODO: Fix issues to remove @ts-ignore
/**
 * Credits to {@link https://gist.github.com/reecelucas @reecelucas} for this hook.
 *
 *
 * {@link https://gist.github.com/reecelucas/2f510e6b8504008deaaa52732202d2da Thread} it was taken from.
 *
 * @returns helpers to enable/disable scroll.
 */
const useScrollBlock = () => {
	const scrollBlocked = useRef();

	// @ts-ignore
	const html = safeDocument.documentElement as Document;

	// @ts-ignore
	const { body } = safeDocument;

	const blockScroll = () => {
		if (!body || !body.style || scrollBlocked.current) return;
		// @ts-ignore
		const scrollBarWidth = window.innerWidth - html.clientWidth;
		const bodyPaddingRight =
			parseInt(
				window
					.getComputedStyle(body)
					.getPropertyValue("padding-right")
			) || 0;
		// @ts-ignore
		html.style.position = "relative"; /* [1] */
		// @ts-ignore
		html.style.overflow = "hidden"; /* [2] */
		body.style.position = "relative"; /* [1] */
		body.style.overflow = "hidden"; /* [2] */
		body.style.paddingRight = `${bodyPaddingRight + scrollBarWidth}px`;
		// @ts-ignore
		scrollBlocked.current = true;
	};

	const allowScroll = () => {
		if (!body || !body.style || !scrollBlocked.current) return;
		// @ts-ignore
		html.style.position = "";
		// @ts-ignore
		html.style.overflow = "";
		body.style.position = "";
		body.style.overflow = "";
		body.style.paddingRight = "";
		// @ts-ignore
		scrollBlocked.current = false;
	};

	return [blockScroll, allowScroll];
};

export interface ModalProps {
	isOpen: boolean;
	open: () => void;
	close: () => void;
	modalKey: ModalKey;
	thisRef: LegacyRef<HTMLDialogElement>;
}

export const useModal = (which: ModalKey): ModalProps => {
	const modalKey = useRef<ModalKey>(which);
	const thisRef = useRef<HTMLDialogElement>(null);
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const { modalsRef, registerModal, close, open } = useModalsStore();

	const [blockScroll, allowScroll] = useScrollBlock();

	const closeMe = () => setIsOpen(false);

	const openMe = () => {
		for (const modal of modalsRef) {
			modal[1].close();
		}
		setIsOpen(true);
	};

	useEffect(() => {
		if (isOpen) blockScroll();
		else allowScroll();
	}, [isOpen]);

	const handleMouseDown = useCallback((e: MouseEvent) => {
		if (
			thisRef.current &&
			!thisRef.current.contains(e.target as Node)
		) {
			closeMe();
		}
	}, []);

	const handleKeyDown = useCallback((e: KeyboardEvent) => {
		if (e.key === "Escape") {
			closeMe();
		}
	}, []);

	const handleScroll = useCallback((e: Event) => {
		e.preventDefault();
	}, []);

	useEffect(() => {
		registerModal(modalKey.current, { open: openMe, close: closeMe });
		[...modalsRef].forEach(console.log);

		document.addEventListener("mousedown", handleMouseDown);
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("mousedown", handleMouseDown);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	return {
		isOpen,
		open: openMe,
		close: closeMe,
		modalKey: modalKey.current,
		thisRef,
	};
};

export const Modal = ({
	children,
	modalProps,
}: {
	children: ReactNode;
	modalProps: ModalProps;
}) => {
	return (
		<dialog
			className="fixed w-96 h-48 z-50 bg-slate-600 top-28 p-2"
			ref={modalProps.thisRef}
			open={modalProps.isOpen}>
			<div className="flex text-slate-200 p-1">
				<button
					onClick={modalProps.close}
					className="ml-auto hover:brightness-110">
					<FontAwesomeIcon size={"lg"} icon={faClose} />
				</button>
			</div>
			<div className="flex p-3 flex-col items-center w-full h-full">
				{children}
			</div>
		</dialog>
	);
};
