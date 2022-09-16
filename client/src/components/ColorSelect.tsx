import { ChangeEvent } from "react";
import { flatColors } from "../App";

export const ColorSelect = ({
	color,
	setColor,
}: {
	color: string;
	setColor: (e: ChangeEvent<HTMLSelectElement>) => void;
}) => {
	return (
		<select
			className="rounded-md appearance-none text-transparent w-full text-lg py-1"
			style={{
				backgroundColor: color,
			}}
			value={color}
			onChange={setColor}
			form="tier-form">
			{Object.keys(flatColors).map((color, index) => {
				const colorValue = flatColors[color];
				return (
					<option
						className="text-lg  text-center uppercase hover:font-bold backdrop-invert "
						style={{
							backgroundColor: colorValue,
						}}
						key={index}
						value={colorValue}>
						{color}
					</option>
				);
			})}
		</select>
	);
};
