import { motion } from "framer-motion";
import { AnimatedTypography } from "../../components/AnimatedTypography";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../hooks/useUser";

export const HomePage: React.FC = () => {
	const navigate = useNavigate();

	const { username } = useUser();

	return (
		<div className="h-full w-full">
			<div className="w-full flex flex-col items-center justify-evenly py-5">
				<p className="text-[#006699] font-semibold text-4xl">
					Hello, {username}
				</p>
				<motion.img
					initial={{
						x: "-200%",
						opacity: 0,
					}}
					animate={{
						x: 0,
						opacity: 1,
					}}
					transition={{
						duration: 0.3,
					}}
					className="w-40 aspect-square"
					src={
						new URL(
							`/assets/e-sign-low-resolution-color-logo.svg`,
							import.meta.url
						).href
					}
				/>
				<p className="text-[#006699] text-lg font-semibold">
					E-sign allows secure digital signing of documents with
					extreme ease. <br />
					View, sign, download and send documents, now all in one
					place!
				</p>

				<div className="flex flex-col items-center  space-y-5 ">
					<p className="text-[#006699]  font-semibold justify-center flex">
						<br /> View, open and share your documents, organised
						like never before.
					</p>
					<motion.img
						initial={{
							x: "-200%",
							opacity: 0,
						}}
						animate={{
							x: 0,
							opacity: 1,
						}}
						transition={{
							duration: 0.3,
						}}
						className="w-32 aspect-square"
						src={
							new URL(
								`/assets/document-svgrepo-com.svg`,
								import.meta.url
							).href
						}
					/>

					<motion.button
						whileTap={{ scale: 0.9 }}
						className="bg-[#006699] w-40 h-14 rounded-3xl text-lg  text-white leading-tight"
						onClick={() => navigate("/documents")}
					>
						View your Documents
					</motion.button>
				</div>

				<div className="flex flex-col items-center space-y-5 py-5">
					<p className="text-[#006699]  font-semibold justify-center flex">
						Upload files for signing easily and with no delays.
					</p>
					<motion.img
						initial={{
							x: "-200%",
							opacity: 0,
						}}
						animate={{
							x: 0,
							opacity: 1,
						}}
						transition={{
							duration: 0.3,
						}}
						className="w-32 aspect-square"
						src={
							new URL(
								`/assets/upload-svgrepo-com.svg`,
								import.meta.url
							).href
						}
					/>

					<motion.button
						whileTap={{ scale: 0.9 }}
						className="bg-[#006699] rounded-3xl text-lg w-40 h-14 text-white leading-tight"
						onClick={() => navigate("/upload")}
					>
						Upload Files
					</motion.button>
				</div>

				<div className="flex flex-col items-center space-y-5 py-5">
					<p className="text-[#006699]  font-semibold justify-center flex">
						View and change your personal details and the app's look
						and feel.
					</p>
					<motion.img
						initial={{
							x: "-200%",
							opacity: 0,
						}}
						animate={{
							x: 0,
							opacity: 1,
						}}
						transition={{
							duration: 0.3,
						}}
						className="w-32 aspect-square"
						src={
							new URL(
								`/assets/profile-round-1342-svgrepo-com.svg`,
								import.meta.url
							).href
						}
					/>

					<motion.button
						whileTap={{ scale: 0.9 }}
						className="bg-[#006699] rounded-3xl text-lg w-40 h-14 text-white leading-tight"
						onClick={() => navigate("/profile")}
					>
						My Profile
					</motion.button>
				</div>
			</div>
		</div>
	);
};

export default HomePage;
