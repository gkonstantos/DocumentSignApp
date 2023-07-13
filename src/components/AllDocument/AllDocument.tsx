import { Variant, motion } from "framer-motion";
import { useCallback } from "react";
import toast from "react-hot-toast";
import useUser from "../../hooks/useUser";
import { EventTypes } from "../../common";
import useCopyToClipBoard from "../../hooks/useCopyToClipBoard";

type AllDocumentProps = {
	initial?: Variant;
	animate?: Variant;
	exit?: Variant;
	file: any;
};

export const AllDocument: React.FC<AllDocumentProps> = (props) => {
	const { initial, animate, exit, file } = props;

	const { username } = useUser();

	const { copy } = useCopyToClipBoard();

	const handleDelete = useCallback((fileToDelete: any) => {
		PubSub.publish(EventTypes.DELETE_FILE, {
			fileToDelete,
			username,
		});
	}, []);

	const onClick = useCallback(() => {
		if (copy(file.path)) toast.success("Link copied!");
		else toast.error("Something went wrong...");
	}, [copy, file.path]);

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
					onClick={() => window.open(file.path)}
					whileTap={{ scale: 0.9 }}
				>
					Open
				</motion.button>
				<motion.button whileTap={{ scale: 0.9 }} onClick={onClick}>
					Share
				</motion.button>
				<motion.button
					whileTap={{ scale: 0.9 }}
					onClick={() => handleDelete(file)}
				>
					Delete
				</motion.button>
			</div>
		</motion.div>
	);
};

export default AllDocument;
