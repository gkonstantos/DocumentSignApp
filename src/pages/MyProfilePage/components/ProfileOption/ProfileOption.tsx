import React, { useState } from "react";
import { motion, Variant } from "framer-motion";
import clsx from "clsx";

export type ProfileOptionProps = {
	initial?: Variant;
	animate?: Variant;
	exit?: Variant;
	/**
	 * @default "primary"
	 */
	variant?: "primary" | "inverted";
	onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
	text: string;
	icon?: string;
	open?: boolean;
};

export const ProfileOption: React.FunctionComponent<ProfileOptionProps> = (
	props
) => {
	const {
		text,
		icon,
		onClick,
		variant = "primary",
		initial,
		animate,
		exit,
		open,
	} = props;

	return (
		<motion.button
			whileTap={{ scale: 0.9 }}
			disabled={!onClick}
			className={clsx(
				"h-14 flex flex-row items-center text-base w-full shadow-xs px-10 rounded-3xl",
				variant === "primary" && "bg-stone-100 dark:bg-zinc-700/40",
				variant === "inverted" &&
					"bg-stone-700 text-gray-50 dark:bg-zinc-700/40"
			)}
			variants={{
				initial: initial ?? {},
				animate: animate ?? {},
				exit: exit ?? {},
			}}
			onClick={ onClick }
		>
			<div className="font-semibold flex-1 flex space-x-4">
				{icon && <img src={icon} width="21" />}
				<p className="text-lg">{text}</p>
			</div>
			{onClick && (
				<motion.img
				animate={ open ? "open": "closed"}
					variants={{
						
						closed: {
							rotate: 0,
						},
						open: {
							opacity: 1,
							rotate: 180,
						},
					}}
					className="h-full"
					src={
						new URL(
							`/assets/arrow-down-svgrepo-com(1).svg`,
							import.meta.url
						).href
					}
					width="28"
				/>
			)}
		</motion.button>
	);
};

export default ProfileOption;
