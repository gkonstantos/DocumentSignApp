import React from "react";
import { motion } from "framer-motion";
import { useMatch, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { AnimatedTypography } from "../AnimatedTypography";

export type NavItemProps = {
	path: string;
	label: string;
	icon?: string;
	iconSelected?: string;
	disabled?: boolean;
};

export const NavItem: React.FunctionComponent<NavItemProps> = React.memo((props) => {
	const { path, label, icon, iconSelected, disabled = false } = props;

	const navigate = useNavigate();
	const match = useMatch(path);

	return (
		<motion.li whileTap={{ scale: 0.9 }}>
			<button
				disabled={disabled}
				className={clsx(
					"relative flex flex-col justify-center items-center px-3 py-1 h-full",
					"disabled:opacity-50"
				)}
				onClick={() => !match && navigate(path)}
			>
				{/* <div
					className="w-full h-4/6 bg-center bg-no-repeat bg-[length:auto_1.5rem]"
					style={{
						backgroundImage: `url('${match ? iconSelected : icon}')`,
					}}
				/> */}
				{/* <p
					title={label}
					className={clsx(
						"text-[#465885] dark:text-zinc-50 text-xs tracking-normal",
						"after:block after:h-0 after:invisible after:content-[attr(title)] after:font-bold after:overflow-hidden after:opacity-0",
						match && "font-bold",
					)}
				>
					{label}
				</p> */}
				<AnimatedTypography className={clsx("text-xl text-[#006699]", match && "font-bold")}>{label}</AnimatedTypography>
			</button>
		</motion.li>
	);
});

export default NavItem;
