import { Variant, motion } from "framer-motion";
import toast from "react-hot-toast";

type AllDocumentProps = {
	initial?: Variant;
	animate?: Variant;
	exit?: Variant;
	file: any;
};

export const AllDocument: React.FC<AllDocumentProps> = (props) => {
	const { initial, animate, exit, file } = props;

	return (
		<motion.div
			className="w-full px-5 space-x-5 flex items-center justify-between h-10 rounded-3xl bg-[#FAFBFF]"
			variants={{
				initial: initial ?? {},
				animate: animate ?? {},
				exit: exit ?? {},
			}}
		>
			<p className="">{file && file.filename}</p>
			<div className="flex space-x-7 text-[#006699]">
				<motion.button
					whileTap={{ scale: 0.9 }}
				>
					Open
				</motion.button>
				<motion.button
					whileTap={{ scale: 0.9 }}
					onClick={() => toast.success("Document Moved to Recycle Bin")}
				>
					Recycle
				</motion.button>
			</div>
		</motion.div>
	);
};

export default AllDocument;
