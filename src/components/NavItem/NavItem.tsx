import React from "react";
import { motion } from "framer-motion";
import { useMatch, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { AnimatedTypography } from "../AnimatedTypography";

export type NavItemProps = {
	path: string;
	label: string;
	disabled?: boolean;
};

export const NavItem: React.FunctionComponent<NavItemProps> = React.memo(
	(props) => {
		const { path, label, disabled = false } = props;

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
					<AnimatedTypography
						className={clsx(
							"text-xl text-[#006699]",
							match && "font-bold"
						)}
					>
						{label}
					</AnimatedTypography>
				</button>
			</motion.li>
		);
	}
);

export default NavItem;
