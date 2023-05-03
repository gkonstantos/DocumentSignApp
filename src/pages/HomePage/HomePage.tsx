import { motion } from "framer-motion";
import { AnimatedTypography } from "../../components/AnimatedTypography";
import SignedFile from "../../components/SignedFile/SignedFile";
import { useState } from "react";
import Modal from "../../components/Modal";

const MockFiles = [
	{ name: "File Example 1", id: 1 },
	{ name: "File Example 2", id: 2 },
	{ name: "File Example 3", id: 3 },
	{ name: "File Example 4", id: 4 },
	{ name: "File Example 5", id: 5 },
];

export const HomePage: React.FC = () => {
	return (
		<div className="h-full w-full flex flex-col items-center ">
			<AnimatedTypography className="text-[#006699] font-semibold text-4xl py-3">
				Hello, George
			</AnimatedTypography>
			<p className="text-[#006699] w-full font-semibold justify-center flex">
				Here is your Overview...
			</p>
			<AnimatedTypography className="text-[#006699] font-semibold text-3xl pt-10 pb-3">
				Signed Files
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
			</motion.div>
		</div>
	);
};

export default HomePage;
