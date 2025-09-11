// Utils
import {Icon} from "@/utils/icons.util";
import { icons } from "lucide-react";
import { type FC, useState } from "react";

type InputStatus = "normal" | "success" | "danger";
type InputType =
	| "text"
	| "textarea"
	| "password"
	| "number"
	| "email"
	| "tel"
	| "url"
	| "date"
	| "datetime-local"
	| "address";
interface IInputProps {
	label: string;
	status?: InputStatus;
	type?: InputType;
	caption?: string;
	disabled?: boolean;
	value?: string | number;
	readonly?: boolean;
	icon?: keyof typeof icons;
	className?: string;
	inputClassName?: string;
	onChange?: (value: string) => void;
	onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const Input: FC<IInputProps> = ({
	label,
	status = "normal",
	type = "text",
	caption,
	disabled,
	value,
	readonly,
	onChange,
	onKeyDown,
	icon,
	className,
	inputClassName
}) => {
	const [showPassword, setShowPassword] = useState(false);

	const buttonStatus: { [key in InputStatus]: { [key: string]: string } } = {
		normal: {
			input: "border-[#CACED8] placeholder-shown:border-[#CACED8]",
			label: "text-paragraph",
			caption: "text-paragraph",
			icon: "text-paragraph"
		},
		success: {
			input: "border-success-700 placeholder-shown:border-success-700",
			label: "before:border-success-700 after:border-success-700 text-success-700",
			caption: "text-success-700",
			icon: "text-success-700"
		},
		danger: {
			input: "border-danger-700 placeholder-shown:border-danger-700",
			label:
				"before:border-danger-700 after:border-danger-700 peer-focus:text-danger-700 text-danger-700",
			caption: "text-danger-700",
			icon: "text-danger-700"
		}
	};

	const isDisabled = disabled ? "opacity-60" : "";
	const hasIcon_Input = icon ? "pl-10" : "";
	const hasIcon_Label = icon ? "peer-placeholder-shown:[&>span]:pl-5 peer-focus:[&>span]:pl-0" : "";

	return (
		<div className={`${isDisabled} ${className} relative w-full`}>
			{type === "textarea" ? (
				<textarea
					placeholder=" "
					disabled={disabled}
					value={value}
					rows={4}
					autoComplete="off"
					readOnly={readonly}
					onChange={(e) => onChange && onChange(e.target.value)}
					className={`${inputClassName} ${buttonStatus[status].input} ${hasIcon_Input} placeholder-shown:border-t-blue-gray-200 disabled:bg-blue-gray-50 peer w-full resize-none rounded-[7px] border border-t-transparent bg-white px-3 py-2.5 font-sans text-body-xs font-normal text-black outline outline-0 transition-all placeholder-shown:border placeholder-shown:bg-[#F4F7FE] focus:border focus:border-primary-700 focus:border-t-transparent focus:outline-0 disabled:border-0`}
				/>
			) : (
				<input
					className={`${inputClassName} ${buttonStatus[status].input} ${hasIcon_Input} placeholder-shown:border-t-blue-gray-200 disabled:bg-blue-gray-50 peer h-full w-full rounded-[7px] border border-t-transparent bg-white px-3 py-2.5 font-sans text-body-xs font-normal text-black outline outline-0 transition-all placeholder-shown:border placeholder-shown:bg-[#F4F7FE] focus:border focus:border-primary-700 focus:border-t-transparent focus:outline-0 disabled:border-0`}
					placeholder=" "
					disabled={disabled}
					value={value}
					onChange={(e) => onChange && onChange(e.target.value)}
					onKeyDown={onKeyDown}
					autoComplete={type === "password" ? "new-password" : "off"}
					readOnly={readonly}
					type={type === "password" && showPassword ? "text" : type}
				/>
			)}
			<label
				className={`label ${buttonStatus[status].label} ${hasIcon_Label} before:content[' '] after:content[' '] peer-placeholder-shown:text-blue-gray-500 pointer-events-none absolute -top-1.5 left-0 flex h-full w-full select-none text-[11px] font-normal leading-tight transition-all before:pointer-events-none before:mr-1 before:mt-[6.5px] before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-l before:border-t before:border-[#CACED8] before:transition-all after:pointer-events-none after:ml-1 after:mt-[6.5px] after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-r after:border-t after:border-[#CACED8] after:transition-all peer-placeholder-shown:text-body-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-primary-700 peer-focus:before:border-l peer-focus:before:border-t peer-focus:before:border-primary-700 peer-focus:after:border-r peer-focus:after:border-t peer-focus:after:border-primary-700 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-paragraph`}>
				<span>{label}</span>
			</label>
			{icon && (
				<div
					className={`${buttonStatus[status].icon} absolute left-3 top-1/2 -translate-y-1/2 transform transition-all peer-focus:text-primary-700`}>
					<Icon
						name={icon}
						size={16}
					/>
				</div>
			)}
			{type === "password" && (
				<div
					className={`${buttonStatus[status].icon} absolute right-3 top-1/2 -translate-y-1/2 transform cursor-pointer transition-all peer-focus:text-primary-700`}>
					{showPassword ? (
						<Icon
							name="EyeOff"
							size={16}
							onClick={() => setShowPassword(false)}
						/>
					) : (
						<Icon
							name="Eye"
							size={16}
							onClick={() => setShowPassword(true)}
						/>
					)}
				</div>
			)}

			{caption && (
				<p className={`${buttonStatus[status].caption} mt-1 text-body-xs font-normal`}>{caption}</p>
			)}
		</div>
	);
};

export default Input;
