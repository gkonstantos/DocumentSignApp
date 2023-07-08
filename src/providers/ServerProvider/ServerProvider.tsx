// ServerProvider.js
import React, { useEffect } from "react";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

export const ServerProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
	const app = express();
	useEffect(() => {
		const dbURI =
			"mongodb+srv://testuser:test123@esign.eprlzdc.mongodb.net/esign?retryWrites=true&w=majority";
		const port = 5173;
		mongoose
			.connect(dbURI, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
			} as any)
			.then((result) => {
				console.log("connected to db");
				app.listen(port, () => {
					console.log(`Server listening on port ${port}`);
				});
			})
			.catch((err) => console.log(err));

		app.use(express.urlencoded({ extended: true }));
		app.use(express.json());

		// Additional server routes and middleware can be added here

		return () => {
			// Cleanup logic if needed
		};
	}, []);

	return <>{children}</>;
};

export default ServerProvider;
