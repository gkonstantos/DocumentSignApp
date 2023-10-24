import { Toaster } from "react-hot-toast";

export const ToastContent: React.FunctionComponent = () => {
	return (
		<Toaster
			containerClassName="!z-toaster !max-h-screen"
			position="bottom-center"
			toastOptions={{
				success: {
					duration: 1000,
					className:
						"bg-emerald-500 text-white text-lg font-medium rounded-3xl shadow-2xl",
				},
				loading: {
					className:
						"bg-gray-500 text-white text-lg font-medium rounded-3xl shadow-2xl",
				},
				error: {
					duration: 1000,
					className:
						"bg-red-500 text-white text-lg font-medium rounded-3xl shadow-2xl",
				},
			}}
		/>
	);
};

export default ToastContent;
