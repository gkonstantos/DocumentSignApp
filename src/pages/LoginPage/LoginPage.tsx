import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../../hooks/useLogin";
import PubSub from "pubsub-js";
import { EventTypes } from "../../common";

export const LoginPage: React.FunctionComponent = () => {
	const [username, setUserName] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	const navigate = useNavigate();
	const { result, login } = useLogin();

	const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			await login(username, password);
		} catch (error) {
			console.error(error);
		}
	};
	useEffect(() => {
		if (result.success) {
			PubSub.publish(EventTypes.LOGIN, {
				username,
				password,
			});
			setUserName("");
			setPassword("");
			navigate("/home");
		}
	}, [result.success, navigate]);

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
			<p className="pb-2 text-[#006699] font-semibold text-4xl">
				Welcome
			</p>
			<form
				action=""
				onSubmit={handleOnSubmit}
				className="flex flex-col space-y-3 items-center"
			>
				<input
					required
					placeholder="Username"
					className="placeholder:text-center placeholder:text-sm placeholder:italic border-2 border-[#006699]"
					value={username}
					onChange={(e) => setUserName(e.target.value)}
				/>
				<input
					required
					type="password"
					className="placeholder:text-center placeholder:text-sm placeholder:italic border-2 border-[#006699]"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>

				<motion.button
					whileTap={{ scale: 0.9 }}
					className="bg-[#006699] rounded-3xl w-32 h-9 text-white"
					type="submit"
					disabled={!username || !password}
				>
					Login
				</motion.button>
			</form>
			<motion.button
				whileTap={{ scale: 0.9 }}
				className="text-[#006699]"
				onClick={() => navigate("register")}
			>
				Click here to Register!
			</motion.button>
		</motion.div>
	);
};

export default LoginPage;
