import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { EventTypes } from "../../common";

export const Loader: React.FunctionComponent = React.memo(() => {
	const [show, setShow] = useState<boolean>();
	const load = PubSub.subscribe(EventTypes.ACTION_LOADING, () =>
		setShow(true)
	);

	const done = PubSub.subscribe(EventTypes.ACTION_FINISHED, () =>
		setShow(false)
	);
	return (
		<AnimatePresence>
			{show && (
				<motion.div
					className="absolute top-0 z-20 h-full w-full bg-gradient-to-t from-gray-500 via-gray-600 to-gray-700"
					initial={{
						opacity: 0,
					}}
					animate={{
						opacity: 0.5,
						transition: {
							duration: 0.6,
						},
					}}
					exit={{
						opacity: 0,
						transition: {
							delay: 0.15,
						},
					}}
				></motion.div>
			)}
		</AnimatePresence>
	);
});

export default Loader;
