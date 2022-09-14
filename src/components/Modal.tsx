import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

import {
	FormEvent,
	LegacyRef,
	ReactNode,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";

export interface ModalProps {
	isOpen: boolean;
	open: () => void;
	close: () => void;
	thisRef: LegacyRef<HTMLDialogElement>;
}

type ModalRefType = LegacyRef<HTMLDialogElement>;

type ModalOpenClose = { close: () => void; open: () => void };

export type ModalsContextProps = {
	modalsRef: React.MutableRefObject<Map<ModalRefType, ModalOpenClose>>;
	registerModal: (ref: ModalRefType, openClose: ModalOpenClose) => void;
};

const useModals = () => {
	const modalsRef = useRef(new Map<ModalRefType, ModalOpenClose>());

	const registerModal = (
		ref: ModalRefType,
		openClose: ModalOpenClose
	) => {
		modalsRef.current.set(ref, openClose);
	};

	return { modalsRef, registerModal };
};

export const useModal = (): ModalProps => {
	const thisRef = useRef<HTMLDialogElement>(null);
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const { modalsRef, registerModal } = useModals();

	const close = () => setIsOpen(false);

	const open = () => {
		for (const modal of modalsRef.current) {
			modal[1].close();
		}
		setIsOpen(true);
	};

	const handleMouseDown = useCallback((e: MouseEvent) => {
		if (
			thisRef.current &&
			!thisRef.current.contains(e.target as Node)
		) {
			close();
		}
	}, []);

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === "Escape") {
			close();
		}
	};

	useEffect(() => {
		registerModal(thisRef, { open, close });
		[...modalsRef.current].forEach(console.log);

		document.addEventListener("mousedown", handleMouseDown);
		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.addEventListener("mousedown", handleMouseDown);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	return { isOpen, open, close, thisRef };
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
