import React, { useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
// import { useAuthenticate, useTalosContext } from "@saicongames/tenet";
import { Input } from "../../components";


export const LoginPage: React.FunctionComponent = () => {
	// const { authenticated, initialized } = useTalosContext();
	// const { authenticate } = useAuthenticate();
	const [username, setUserName] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	// const login = () => {
	// 	initialized &&
	// 		!authenticated &&
	// 		authenticate({
	// 			data: {
	// 				username,
	// 				password,
	// 				userGroupId: import.meta.env.VITE_USERGROUP_ID,
	// 			},
	// 		});
	// };

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
			<Input required placeholder="Username" value={username} onChange={(e) => setUserName(e.target.value)} />
			<Input required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

			<button
				className="mt-10 bg-slate-50 w-32 p-2"
				type="submit"
				// onClick={login}
				disabled={!username || !password}
			>
				Login
			</button>
		</motion.div>
	);
};


export default LoginPage;
