import React from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import NavItem from "../NavItem/NavItem";
import { useTranslation } from "react-i18next";

export const TopNav: React.FunctionComponent = () => {
	const { t } = useTranslation();
	return (
		<motion.div
			className={clsx("w-full h-auto fixed top-0", "bg-[#FAFBFF] ")}
		>
			<motion.ul
				className="w-full flex justify-evenly h-20 py-2"
				variants={{
					open: {
						transition: {
							staggerChildren: 0.1,
						},
					},
				}}
			>
				<NavItem path="home" label={t("TOPNAV.HOME")} />
				<NavItem path="documents" label={t("TOPNAV.MY_DOCUMENTS")} />
				<NavItem path="upload" label={t("TOPNAV.UPLOAD")} />
				<NavItem path="profile" label={t("TOPNAV.MY_PROFILE")} />
			</motion.ul>
		</motion.div>
	);
};

export default TopNav;
