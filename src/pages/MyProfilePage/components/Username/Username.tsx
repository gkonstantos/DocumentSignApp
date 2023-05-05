import { Variant, motion } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";

type UserNameProps = {
	initial?: Variant;
	animate?: Variant;
	exit?: Variant;
};

export const Username: React.FC<UserNameProps> = (props) => {
	const { initial, animate, exit } = props;

	const [password, setPassword] = useState<string>("");
	const [username, setUsername] = useState<string>("");

	const handleClick = () => {
		if (password && username) {
			toast.success("Username Changed");
		} else {
			toast.error("Something went Wrong...");
		}
	};

	return (
		<motion.div
			className="flex flex-col items-center space-y-5"
			variants={{
				initial: initial ?? {},
				animate: animate ?? {},
				exit: exit ?? {},
			}}
		>
			<input
				placeholder="New Username*"
				className="placeholder:text-center placeholder:text-sm placeholder:italic border-2 border-[#006699]"
				value={username}
				required
				onChange={(e) => setUsername(e.target.value)}
			></input>
			<input
				type="password"
				required
				placeholder="Your Password*"
				className="placeholder:text-center placeholder:text-sm placeholder:italic border-2 border-[#006699]"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
			></input>
			<motion.button
				whileTap={{ scale: 0.9 }}
				disabled={!username || !password}
				className="bg-[#006699] rounded-3xl w-32 h-9 text-white"
				onClick={handleClick}
			>
				Save
			</motion.button>
		</motion.div>
	);
};

export default Username;
