// Utils
import {Icon} from "@/utils/icons.util";
import clsx from "clsx";
import { type FC, useEffect, useRef, useState } from "react";

interface ICheckboxProps {
	checked?: boolean;
	disabled?: boolean;
	onChange?: (value: boolean) => void;
}

const Checkbox: FC<ICheckboxProps> = ({ checked, onChange, disabled }) => {
	const checkboxRef = useRef<HTMLInputElement>(null);
	const [isChecked, setIsChecked] = useState(false);

	useEffect(() => {
		setIsChecked(checked || false);
	}, [checked]);

	return (
		<>
			<input
				type="checkbox"
				disabled={disabled}
				ref={checkboxRef}
				className="peer hidden"
				checked={isChecked}
				onChange={(e) => {
					setIsChecked(e.target.checked);
					onChange && onChange(e.target.checked);
				}}
			/>
			<div
				className={clsx(
					"focus:ring-[#C9DEFF]] flex h-6 w-6 items-center justify-center rounded-md border border-[#CACED8] text-white hover:border-primary-hover focus:ring-2 peer-checked:border-primary-700 peer-checked:bg-primary-700 peer-checked:ring-0 peer-checked:ring-offset-0 peer-checked:hover:bg-primary-hover",
					{
						"pointer-events-none opacity-50": disabled
					}
				)}
				onClick={() => {
					checkboxRef.current?.click();
				}}>
				{isChecked && (
					<Icon
						name="Check"
						size={16}
					/>
				)}
			</div>
		</>
	);
};

export default Checkbox;
