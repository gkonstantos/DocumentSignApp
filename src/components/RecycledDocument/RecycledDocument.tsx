import { Variant, motion } from "framer-motion";
import toast from "react-hot-toast";

type RecycledDocumentProps = {
	initial?: Variant;
	animate?: Variant;
	exit?: Variant;
	file: any;
};

export const RecycledDocument: React.FC<RecycledDocumentProps> = (props) => {
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
			<p>{file?.name}</p>
			<div className="flex space-x-7 text-[#006699]">
				<motion.button
					whileTap={{ scale: 0.9 }}
                    onClick={() => toast.success("File Restored")}
				>
					Restore
				</motion.button>
				<motion.button
					whileTap={{ scale: 0.9 }}
					onClick={() => toast.success("File Permanently Deleted")}
				>
					Delete
				</motion.button>
				
			</div>
		</motion.div>
	);
};

export default RecycledDocument;