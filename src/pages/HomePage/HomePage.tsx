import { motion } from "framer-motion";
import { AnimatedTypography } from "../../components/AnimatedTypography";
import SignedFile from "../../components/SignedFile/SignedFile";
import { useNavigate } from "react-router-dom";

const MockFiles = [
	{ name: "File Example 1", id: 1 },
	{ name: "File Example 2", id: 2 },
	{ name: "File Example 3", id: 3 },
	{ name: "File Example 4", id: 4 },
	{ name: "File Example 5", id: 5 },
];

export const HomePage: React.FC = () => {
	const navigate = useNavigate();

	return (
		<div className="h-full w-full flex flex-col items-center ">
			<AnimatedTypography className="text-[#006699] font-semibold text-4xl py-3">
				Hello, George
			</AnimatedTypography>
			<p className="text-[#006699] text-lg w-1/2 font-semibold justify-center flex">
				Docu App allows secure digital signing of documents with extreme
				ease. View, sign, download and send documents, now all in one
				place!
			</p>
			<div className="w-full h-full flex flex-col items-center justify-evenly py-5">
				<div className="flex flex-col items-center w-1/2 space-y-5">
					<motion.img
						initial={{
							x: "-200%",
							opacity: 0,
						}}
						animate={{
							x: 0,
							opacity: 1,
						}}
						transition= {{
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
					<p className="text-[#006699]  font-semibold justify-center flex">
						<br /> View, open and share your documents, organised
						like never before.
					</p>
					<button
						className="bg-[#006699] w-40 h-14 rounded-3xl text-lg  text-white leading-tight"
						onClick={() => navigate("documents")}
					>
						View your Documents
					</button>
				</div>

				<div className="flex flex-col items-center w-1/2 space-y-5">
					<motion.img
						initial={{
							x: "-200%",
							opacity: 0,
						}}
						animate={{
							x: 0,
							opacity: 1,
						}}
						transition= {{
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
					<p className="text-[#006699]  font-semibold justify-center flex">
						Upload files for signing easily and with no delays.
					</p>
					<button
						className="bg-[#006699] rounded-3xl text-lg w-40 h-14 text-white leading-tight"
						onClick={() => navigate("upload")}
					>
						Upload Files
					</button>
				</div>

				<div className="flex flex-col items-center w-1/2 space-y-5">
					<motion.img
						initial={{
							x: "-200%",
							opacity: 0,
						}}
						animate={{
							x: 0,
							opacity: 1,
						}}
						transition= {{
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
					<p className="text-[#006699]  font-semibold justify-center flex">
						View and change your personal details and the app's look
						and feel.
					</p>
					<button
						className="bg-[#006699] rounded-3xl text-lg w-40 h-14 text-white leading-tight"
						onClick={() => navigate("profile")}
					>
						My Profile
					</button>
				</div>
			</div>

			{/* <AnimatedTypography className="text-[#006699] font-semibold text-3xl pt-10 pb-3">
				Signed Documents
			</AnimatedTypography>
			<motion.div
				className="space-y-3 w-1/2 flex flex-col items-center"
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
				{MockFiles.map((file, index) => (
					<SignedFile
						key={index}
						initial={{
							y: "200%",
							opacity: 0,
						}}
						animate={{
							y: 0,
							opacity: 1,
						}}
						file={file}
					/>
				))}
			</motion.div> */}
		</div>
	);
};

export default HomePage;
