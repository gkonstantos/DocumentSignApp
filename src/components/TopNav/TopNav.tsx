import React from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import NavItem from "../NavItem/NavItem";

export const TopNav: React.FunctionComponent = () => {

	return (
		<motion.div 
			className={clsx(
				"w-full h-auto fixed top-0",
				"bg-[#FAFBFF] ",
			)}
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
				<NavItem
					path="/"
					label="Home"
					// icon={new URL(`/assets/Icon ionic-md-home.svg`, import.meta.url).href}
					// iconSelected={new URL(`/assets/Icon ionic-md-homeSelected.svg`, import.meta.url).href}
				/>
				<NavItem
					path="files"
					label="My Files"
					// icon={new URL(`/assets/Icon feather-target.svg`, import.meta.url).href}
					// iconSelected={new URL(`/assets/Icon feather-targetSelected.svg`, import.meta.url).href}
				/>
				<NavItem
					path="upload"
					label="Upload"
					// icon={new URL(`/assets/Icon feather-award.svg`, import.meta.url).href}
					// iconSelected={new URL(`/assets/Icon feather-awardSelected.svg`, import.meta.url).href}
				/>
				<NavItem
					path="profile"
					label="My Profile"
					// icon={new URL(`/assets/Icon feather-gift.svg`, import.meta.url).href}
					// iconSelected={new URL(`/assets/Icon feather-giftSelected.svg`, import.meta.url).href}
				/>
				
			</motion.ul>
		</motion.div>
	);
};

export default TopNav;