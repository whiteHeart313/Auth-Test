// Utils
import {Icon , SpinnerIcon } from "@/utils/icons.util";
import { icons } from "lucide-react";
import { type FC, type JSX } from "react";

type ButtonStatus = "normal" | "success" | "danger";
type ButtonType = "primary" | "secondary" | "subtle" | "text";

interface IButtonProps {
	disabled?: boolean;
	loading?: boolean;
	active?: boolean;
	text?: string;
	iconRight?: keyof typeof icons;
	iconLeft?: keyof typeof icons;
	type?: ButtonType;
	status?: ButtonStatus;
	className?: string;
	rounded?: boolean;
	medium?: boolean;
	iconOnly?: boolean;
	buttonType?: "button" | "submit" | "reset";
	onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
	iconSize?: number;
}

const Button: FC<IButtonProps> = ({
	disabled,
	active,
	loading,
	text,
	iconRight,
	iconLeft,
	type = "primary",
	status = "normal",
	className,
	rounded,
	medium,
	iconOnly,
	iconSize = 16,
	buttonType = "button",
	onClick
}) => {
	const buttonStatus: { [key in ButtonStatus]: JSX.Element } = {
		normal: (
			<>
				{iconLeft && (
					<span>
						<Icon
							name={iconLeft}
							size={iconSize}
						/>
					</span>
				)}
				{!iconOnly && <span className="relative">{text}</span>}
				{iconRight && (
					<span>
						<Icon
							name={iconRight}
							size={iconSize}
						/>
					</span>
				)}
			</>
		),
		success: (
			<Icon
				name="Check"
				size={16}
			/>
		),
		danger: (
			<Icon
				name="X"
				size={16}
			/>
		)
	};

	const buttonStatusStyle: {
		[key in ButtonType]: { [key in ButtonStatus]: string };
	} = {
		primary: {
			normal: "bg-primary-700 hover:bg-primary-hover focus:ring-primary-300 text-white",
			success: "bg-success-600 hover:bg-success-hover focus:ring-success-300 text-white",
			danger: "bg-danger-600 hover:bg-danger-hover focus:ring-danger-300 text-white"
		},
		secondary: {
			normal: "bg-secondary-600 hover:bg-secondary-700 focus:ring-secondary-300 text-white",
			success: "bg-auxiliary-600 hover:bg-auxiliary-hover focus:ring-auxiliary-300 text-white",
			danger: "bg-danger-600 hover:bg-danger-hover focus:ring-danger-300 text-white"
		},
		subtle: {
			normal:
				"border-primary-700 hover:border-primary-hover hover:text-primary-hover focus:ring-primary-300 text-primary-700",
			success: "border-success-700 focus:ring-success-300 text-success-700",
			danger: "border-danger-600 focus:ring-danger-300 text-danger-600"
		},
		text: {
			normal:
				"border-[#E0E5F2] hover:border-secondary-hover hover:text-secondary-hover focus:ring-secondary-100 text-secondary-700 bg-white",
			success: "border-[#E0E5F2] focus:ring-secondary-100 text-success-700 bg-white",
			danger: "border-[#E0E5F2] focus:ring-secondary-100 text-danger-600 bg-white"
		}
	};

	const isButtonRounded = rounded ? "rounded-full" : "rounded-lg";
	const isButtonMedium = medium ? "py-1 min-h-[40px]" : "py-3 min-h-[48px]";

	const isButtonIconOnly = iconOnly ? "min-w-[48px]" : "min-w-[134px]";
	const isActiveButtonIconOnly = iconOnly ? "-right-12" : "-right-4";

	return (
		<button
			className={`${className} ${buttonStatusStyle[type][status]} ${isButtonRounded} ${isButtonMedium} ${isButtonIconOnly} relative flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap border px-3 text-body-sm font-medium transition-all duration-200 focus:ring-[3px] disabled:cursor-not-allowed disabled:opacity-30`}
			disabled={disabled || loading}
			type={buttonType}
			onClick={onClick}>
			{active && (
				<span
					className={`absolute top-1/2 block h-20 w-20 -translate-y-1/2 rounded-full bg-[#000] bg-opacity-[0.13] ${isActiveButtonIconOnly}`}
				/>
			)}
			<>{loading ? <SpinnerIcon /> : buttonStatus.normal}</>
		</button>
	);
};

export default Button;
