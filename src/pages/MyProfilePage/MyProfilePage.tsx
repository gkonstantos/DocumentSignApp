import { motion } from "framer-motion";
import { useState } from "react";
import Username from "./components/Username";
import { useNavigate } from "react-router-dom";
import useUser from "../../hooks/useUser";
import ProfileOption from "./components/ProfileOption";
import { useTranslation } from "react-i18next";

export const MyProfilePage: React.FC = () => {
	const { username } = useUser();
	const navigate = useNavigate();
	const { t } = useTranslation();

	const [usernameVisible, setUsernameVisible] = useState<boolean>(false);
	const [usernameOpen, setUsernameOpen] = useState<boolean>(false);

	return (
		<div className="h-full w-full flex flex-col  items-center space-y-5">
			<p className="text-[#006699] font-semibold text-4xl py-3 text-center">
				{username}
			</p>

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
					text={t("PROFILE.CHANGE_USERNAME")}
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
					text={t("PROFILE.LOGOUT")}
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
					onClick={() => {
						navigate("/");
						localStorage.clear();
					}}
				/>
			</motion.div>
		</div>
	);
};

export default MyProfilePage;
