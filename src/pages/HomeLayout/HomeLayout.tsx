import { Outlet } from "react-router-dom";
import { TopNav } from "../../components/TopNav";
import { motion } from "framer-motion";

export const HomeLayout: React.FC = () => {
	return (
		<motion.div
			className="h-full w-full flex flex-col justify-between overflow-x-hidden pt-24 z-50"
			initial="exit"
			animate="open"
			exit="exit"
		>
			<div className="flex h-full overflow-y-auto overflow-x-hidden">
				<Outlet />
			</div>
			<TopNav />
		</motion.div>
	);
};

export default HomeLayout;
