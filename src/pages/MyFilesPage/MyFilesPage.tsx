import { motion } from "framer-motion";
import { AnimatedTypography, SignedFile } from "../../components";
import { AllDocument } from "../../components/AllDocument";
import { RecycledDocument } from "../../components/RecycledDocument";
import { useEffect } from "react";
import { useGetFiles } from "../../hooks/useGetFiles";
import useUser from "../../hooks/useUser";
import { toast } from "react-hot-toast";

const MockAllFiles = [
	{ name: "File Example 1", id: 1 },
	{ name: "File Example 2", id: 2 },
	{ name: "File Example 3", id: 3 },
	{ name: "File Example 4", id: 4 },
	{ name: "File Example 5", id: 5 },
	{ name: "File Example 6", id: 6 },
	{ name: "File Example 7", id: 7 },
	{ name: "File Example 8", id: 8 },
];

const MockFiles = [
	{ name: "File Example 1", id: 1 },
	{ name: "File Example 2", id: 2 },
	{ name: "File Example 3", id: 3 },
	{ name: "File Example 4", id: 4 },
	{ name: "File Example 5", id: 5 },
];

const MockRecycledFiles = [
	{ name: "Recycled File Example 1", id: 1 },
	{ name: "Recycled File Example 2", id: 2 },
];

export const MyFilesPage: React.FC = () => {
	const { username } = useUser();
	const { files, result, data } = useGetFiles();

	useEffect(() => {
		const fetchData = async () => {
			try {
				await files(username);
			} catch (error) {
				console.error(error);
			}
		};

		fetchData();
		if(result.error) {
			toast.error("Error during file fetching...")
		}
	}, []);

	console.log(data);

	return (
		<div className="h-full w-full flex flex-col items-center">
			<p className="text-[#006699] font-semibold text-4xl py-3 text-center">
				All your Documents, in one place!
			</p>
			<p className="text-[#006699] w-full font-semibold justify-center flex">
				Here is your Overview...
			</p>
			<AnimatedTypography className="text-[#006699] font-semibold text-3xl pt-10 pb-3">
				All Documents
			</AnimatedTypography>
			{data.length > 0 ? (
				<>
					<p className="text-[#006699] w-full font-semibold justify-center flex pb-2">
						Click Open to View and Sign Documents.
					</p>
					<motion.div
						className="space-y-3 w-1/2 flex flex-col items-center "
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
						{data.map((file, index) => (
							<AllDocument
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
				</>
			) : (
				<p className="text-[#006699] w-full font-semibold justify-center flex pb-2">
					No files uploaded yet!
				</p>
			)}

			<AnimatedTypography className="text-[#006699] font-semibold text-3xl pt-10 pb-3">
				Signed Documents
			</AnimatedTypography>
			<AnimatedTypography className="text-[#006699] w-full font-semibold justify-center flex pb-2">
				Cilck Share to copy share link.
			</AnimatedTypography>
			<motion.div
				className="space-y-3 w-1/2 flex flex-col items-center "
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
			{/* <AnimatedTypography className="text-[#006699] font-semibold text-3xl pt-10 pb-3">
				Recycled Documents
			</AnimatedTypography>
			<p className="text-[#006699] w-full font-semibold justify-center flex pb-2">
				Delete Documents permanently.
			</p>
			<motion.div
				className="space-y-3 w-1/2 flex flex-col items-center pb-20"
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
				{MockRecycledFiles.map((file, index) => (
					<RecycledDocument
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

export default MyFilesPage;
