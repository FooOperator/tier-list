import { faToggleOn } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, ReactNode, useRef } from "react";

type BaseButtonProps = {
	children: ReactNode;
	disabled?: boolean;
	onClick?: (...args: unknown[]) => unknown;
};

export const SolidButton = ({
	children,
	...buttonProps
}: BaseButtonProps) => {
	return (
		<button {...buttonProps} className="solid-button">
			{children}
		</button>
	);
};

type SubmitButtonProps = BaseButtonProps & {
	form: string;
};

export const SubmitButton = ({
	children,
	form,
	disabled,
	...buttonProps
}: SubmitButtonProps) => {
	return (
		<button
			className="submit-button"
			type="submit"
			form={form}
			{...buttonProps}>
			{children}
		</button>
	);
};

export const GhostButton = ({
	children,
	...buttonProps
}: BaseButtonProps) => {
	return (
		<button {...buttonProps} className="ghost-button">
			{children}
		</button>
	);
};

type ToggleProps = BaseButtonProps & {
	on: boolean;
	toggle: () => void;
	name?: string;
};

export const Toggle = ({
	on,
	toggle,
	children,
	onClick,
	name,
	...buttonProps
}: ToggleProps) => {
	const checkboxRef = useRef<HTMLInputElement>(null);

	const handleButtonClick = () => {
		checkboxRef.current?.click();
	};

	return (
		<button
			className="toggle"
			onClick={handleButtonClick}
			{...buttonProps}>
			<FontAwesomeIcon
				size={"lg"}
				icon={on ? faToggleOn : faToggleOn}
			/>
			<span>{children}</span>
			<input
				ref={checkboxRef}
				onClick={toggle}
				checked={on}
				name={name}
				type="checkbox"
			/>
		</button>
	);
};
