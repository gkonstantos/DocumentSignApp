import { motion } from "framer-motion";
import { AnimatedTypography } from "../../components";
import { AllDocument } from "../../components/AllDocument";
import { useEffect } from "react";
import { useGetFilesProv } from "../../hooks/useGetFilesProv";
import { EventTypes } from "../../common";
import { useTranslation } from "react-i18next";

export const MyFilesPage: React.FC = () => {
	const { files } = useGetFilesProv();

	const { t } = useTranslation();
	useEffect(() => {
		PubSub.publish(EventTypes.REFRESH);
	}, []);

	return (
		<div className="h-full w-full flex flex-col items-center">
			<p className="text-[#006699] font-semibold text-4xl py-3 text-center">
				{t("MY_DOCUMENTS.TITLE")}
			</p>
			<p className="text-[#006699] w-full font-semibold justify-center flex">
				{t("MY_DOCUMENTS.SUBTITLE")}
			</p>
			<AnimatedTypography className="text-[#006699] font-semibold text-3xl pt-10 pb-3">
				{t("MY_DOCUMENTS.ALL_DOCUMENTS")}
			</AnimatedTypography>
			{files.length > 0 ? (
				<>
					<p className="text-[#006699] w-full font-semibold justify-center flex pb-2">
						{t("MY_DOCUMENTS.ALL_DOCUMENTS_SUBTITLE")}
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
						{files
							.filter((file) => file.signed === false)
							.map((file, index) => (
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
					{t("MY_DOCUMENTS.NO_FILES_UPLOADED")}
				</p>
			)}

			<AnimatedTypography className="text-[#006699] font-semibold text-3xl pt-10 pb-3">
				{t("MY_DOCUMENTS.SIGNED_DOCUMENTS")}
			</AnimatedTypography>
			<AnimatedTypography className="text-[#006699] w-full font-semibold justify-center flex pb-2">
				{t("MY_DOCUMENTS.SIGNED_DOCUMENTS_SUBTITLE")}
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
				{files
					.filter((file) => file.signed === true)
					.map((file, index) => (
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
		</div>
	);
};

export default MyFilesPage;
