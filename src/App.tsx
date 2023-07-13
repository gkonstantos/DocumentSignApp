import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./components/AppRouter";
import ToastContent from "./components/ToastContent";
import React from "react";
import { UserProvider } from "./providers/UserProvider/UserProvider";
import { FilesProvider } from "./providers/FilesProvider/FilesProvider";

export const App: React.FC = () => {
	return (
		<UserProvider>
			<FilesProvider>
				<ToastContent />
				<BrowserRouter>
					<AppRouter />
				</BrowserRouter>
			</FilesProvider>
		</UserProvider>
	);
};

export default App;
