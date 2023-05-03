import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./components/AppRouter";

export const App: React.FC = () => {
	return (
		<BrowserRouter>
			<AppRouter />
		</BrowserRouter>
	);
};

export default App;
