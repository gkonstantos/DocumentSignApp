import { motion } from "framer-motion";
import { AnimatedTypography } from "../../components";
import ProfileOption from "./components/ProfileOption";
import { useState } from "react";
import Username from "./components/Username";
import { Password } from "./components/Password";

export const MyProfilePage: React.FC = () => {
	const [usernameVisible, setUsernameVisible] = useState<boolean>(false);
	const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
	const [usernameOpen, setUsernameOpen] = useState<boolean>(false);
	const [passwordOpen, setPasswordOpen] = useState<boolean>(false);
	return (
		<div className="h-full w-full flex flex-col  items-center space-y-5">
			<AnimatedTypography className="text-[#006699] font-semibold text-4xl py-3">
				George
			</AnimatedTypography>

			<motion.div
				className="flex flex-col gap-y-3 w-1/2"
				initial="initial"
				animate="animate"
				variants={{
					animate: {
						transition: {
							staggerChildren: 0.2,
						},
					},
				}}
			>
				<ProfileOption
					text="Change Username"
					icon={
						new URL(`/assets/profile_edit.svg`, import.meta.url)
							.href
					}
					initial={{
						y: "200%",
						opacity: 0,
					}}
					animate={{
						y: 0,
						opacity: 1,
						transition: {
							ease: "easeOut",
						},
					}}
					onClick={() => {
						setUsernameVisible(!usernameVisible);
						setUsernameOpen(!usernameOpen);
					}}
					open={usernameOpen}
				/>
				{usernameVisible && (
					<Username
						initial={{
							opacity: 0,
						}}
						animate={{
							opacity: 1,
						}}
					/>
				)}

				<ProfileOption
					text="Change Password"
					icon={
						new URL(`/assets/profile_consents.svg`, import.meta.url)
							.href
					}
					initial={{
						y: "200%",
						opacity: 0,
					}}
					animate={{
						y: 0,
						opacity: 1,
						transition: {
							ease: "easeOut",
						},
					}}
					onClick={() => {
						setPasswordVisible(!passwordVisible);
						setPasswordOpen(!passwordOpen);
					}}
					open={passwordOpen}
				/>
				{passwordVisible && (
					<Password
						initial={{
							opacity: 0,
						}}
						animate={{
							opacity: 1,
						}}
					/>
				)}
				<ProfileOption
					text="Change Theme"
					icon={new URL(`/assets/theme.svg`, import.meta.url).href}
					initial={{
						y: "200%",
						opacity: 0,
					}}
					animate={{
						y: 0,
						opacity: 1,
						transition: {
							ease: "easeOut",
						},
					}}
				/>
				<ProfileOption
					text="Logout"
					icon={
						new URL(
							`/assets/logout-svgrepo-com.svg`,
							import.meta.url
						).href
					}
					initial={{
						y: "200%",
						opacity: 0,
					}}
					animate={{
						y: 0,
						opacity: 1,
						transition: {
							ease: "easeOut",
						},
					}}
				/>
			</motion.div>
		</div>
	);
};

export default MyProfilePage;
