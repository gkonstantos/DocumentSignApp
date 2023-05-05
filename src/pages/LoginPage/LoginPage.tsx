import React, { useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import { AnimatedTypography } from "../../components";

export const LoginPage: React.FunctionComponent = () => {
	const [username, setUserName] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	const navigate = useNavigate();

	return (
		<motion.div
			className={clsx("relative flex flex-col items-center gap-y-2")}
			initial={{
				bottom: -1000,
			}}
			animate={{
				top: "35vh",
				transition: {
					duration: 0.7,
				},
			}}
		>
			<img
				className="w-52 aspect-square"
				src={
					new URL(
						`/assets/e-sign-low-resolution-color-logo.svg`,
						import.meta.url
					).href
				}
			/>
			<AnimatedTypography className="text-[#006699] font-semibold text-4xl">
				Welcome
			</AnimatedTypography>
			<input
				required
				placeholder="Username"
				className="placeholder:text-center placeholder:text-sm placeholder:italic border-2 border-[#006699]"
				value={username}
				onChange={(e) => setUserName(e.target.value)}
			/>
			<input
				required
				className="placeholder:text-center placeholder:text-sm placeholder:italic border-2 border-[#006699]"
				placeholder="Password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
			/>

			<motion.button
				whileTap={{ scale: 0.9 }}
				className="bg-[#006699] rounded-3xl w-32 h-9 text-white"
				type="submit"
				onClick={() => navigate("home")}
				disabled={!username || !password}
			>
				Login
			</motion.button>
		</motion.div>
	);
};

export default LoginPage;
