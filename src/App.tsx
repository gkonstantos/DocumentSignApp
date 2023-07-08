import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./components/AppRouter";
import ToastContent from "./components/ToastContent";
import React from "react";
import { UserProvider } from "./providers/UserProvider/UserProvider";

export const App: React.FC = () => {
	return (
		<UserProvider>
			<ToastContent />
			<BrowserRouter>
				<AppRouter />
			</BrowserRouter>
		</UserProvider>
	);
};

export default App;
