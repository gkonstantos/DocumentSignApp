import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./components/AppRouter";
import ToastContent from "./components/ToastContent";

export const App: React.FC = () => {
	return (
		<>
			<ToastContent />
			<BrowserRouter>
				<AppRouter />
			</BrowserRouter>
		</>
	);
};

export default App;
