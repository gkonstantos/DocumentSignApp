import clsx from "clsx";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useRegister from "../../hooks/useRegister";

export const RegisterPage: React.FC = () => {
	const [username, setUserName] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [checkPassword, setCheckPassword] = useState<string>("");

	const navigate = useNavigate();

	const { result, register } = useRegister();

	const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		try {
			await register(username, password);
		} catch (error) {
			console.error(error);
		}
	};
	useEffect(() => {
		if (result.success) {
			setUserName("");
			setPassword("");
			setCheckPassword("");
			navigate("/");
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
				Welcome to e-sign
			</p>
			<form
				action=""
				onSubmit={handleOnSubmit}
				className="flex flex-col space-y-3 items-center"
			>
				<input
					required
					name="username"
					placeholder="Username"
					className="placeholder:text-center placeholder:text-sm placeholder:italic border-2 border-[#006699]"
					value={username}
					onChange={(e) => setUserName(e.target.value)}
				/>
				<input
					required
					name="password"
					type="password"
					className="placeholder:text-center placeholder:text-sm placeholder:italic border-2 border-[#006699]"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<input
					required
					type="password"
					className="placeholder:text-center placeholder:text-sm placeholder:italic border-2 border-[#006699]"
					placeholder="Repeat Password"
					value={checkPassword}
					onChange={(e) => setCheckPassword(e.target.value)}
				/>

				<motion.button
					whileTap={{ scale: 0.9 }}
					className={clsx(
						"bg-[#006699] rounded-3xl w-32 h-9 text-white"
					)}
					type="submit"
					disabled={
						!username || !password || password !== checkPassword
					}
				>
					Register
				</motion.button>
			</form>
			<motion.button
				whileTap={{ scale: 0.9 }}
				className="text-[#006699]"
				onClick={() => navigate("/")}
			>
				Back to Login!
			</motion.button>
		</motion.div>
	);
};

export default RegisterPage;
