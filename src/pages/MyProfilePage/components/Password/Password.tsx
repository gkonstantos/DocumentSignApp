import clsx from "clsx";
import { Variant, motion } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";

type PasswordProps = {
	initial?: Variant;
	animate?: Variant;
	exit?: Variant;
};

export const Password: React.FC<PasswordProps> = (props) => {
	const { initial, animate, exit } = props;

	const [currentPassword, setCurrentPassword] = useState<string>("");
	const [newPassword, setNewPassword] = useState<string>("");
	const [repeatPassword, setRepeatPassword] = useState<string>("");

	const handleClick = () => {
		if (
			currentPassword &&
			newPassword &&
			repeatPassword &&
			currentPassword !== newPassword &&
			newPassword === repeatPassword
		) {
			toast.success("Password Changed");
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
				required
				type="password"
				placeholder="Current Password*"
				className="placeholder:text-center placeholder:text-sm placeholder:italic border-2 border-[#006699]"
				value={currentPassword}
				onChange={(e) => setCurrentPassword(e.target.value)}
			></input>
			<input
				required
				type="password"
				placeholder="New Password*"
				className={clsx(
					"placeholder:text-center placeholder:text-sm placeholder:italic border-2 border-[#006699]"
				)}
				value={newPassword}
				onChange={(e) => setNewPassword(e.target.value)}
			></input>
			<input
				required
				type="password"
				placeholder="Repeat new Password*"
				className={clsx(
					"placeholder:text-center placeholder:text-sm placeholder:italic border-2 border-[#006699]"
				)}
				value={repeatPassword}
				onChange={(e) => setRepeatPassword(e.target.value)}
			></input>
			<motion.button
				whileTap={{ scale: 0.9 }}
				className="bg-[#006699] rounded-3xl w-32 h-9 text-white"
				onClick={handleClick}
				disabled={!currentPassword || !repeatPassword || !newPassword}
			>
				Save
			</motion.button>
		</motion.div>
	);
};

export default Password;
