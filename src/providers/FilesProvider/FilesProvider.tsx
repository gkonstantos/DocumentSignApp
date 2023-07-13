import { useState, useEffect } from "react";
import { EventTypes } from "../../common";
import { FilesContext } from "../../context/FilesContext/context";
import useGetFiles from "../../hooks/useGetFiles";
import useUser from "../../hooks/useUser";
import useDeleteFile from "../../hooks/useDeleteFile";
import toast from "react-hot-toast";
import useUploadFileToCloud from "../../hooks/useUploadFileToCloud";
import useUploadFile from "../../hooks/useUploadFile";

export const FilesProvider: React.FC<React.PropsWithChildren> = ({
	children,
}) => {
	const { files, data } = useGetFiles();
	const { username } = useUser();

	const [userFiles, setUserFfiles] = useState<Array<any>>([]);
	const [acceptedFiles, setAcceptedFiles] = useState<any>([]);

	const { fileDelete, result } = useDeleteFile();
	const { res, cloudFile, publicUrl } = useUploadFileToCloud();
	const { uploadResult, file } = useUploadFile();


	// GET FILES
	useEffect(() => {
		const fetchData = async () => {
			try {
				await files(username);
			} catch (error) {
				console.error(error);
			}
		};

		{
			username && fetchData();
		}

		const subscription = PubSub.subscribe(EventTypes.REFRESH, fetchData);

		return () => {
			// Cleanup the subscription when the component unmounts
			PubSub.unsubscribe(subscription);
		};
	}, [username]);

	//DELETE
	useEffect(() => {
		const handleDeleteFile = async (
			fileToDelete: any,
			username: string
		) => {
			try {
				await fileDelete(
					fileToDelete._id,
					`${fileToDelete.filename}_${username}`
				);
				PubSub.publish(EventTypes.REFRESH);
				toast.success("File deleted!");
			} catch (error) {
				console.error(error);
				toast.error("Something went wrong...");
			}
		};

		const sub = PubSub.subscribe(
			EventTypes.DELETE_FILE,
			function (msg, data) {
				const { fileToDelete, username } = data;
				handleDeleteFile(fileToDelete, username);
			}
		);

		return () => {
			PubSub.unsubscribe(sub);
		};
	}, []);

	//UPLOAD

	useEffect(() => {
		const handleUploadFile = async (
			acceptedFiles: Array<File>,
			username: string
		) => {
			try {
				const file = acceptedFiles[0];
				setAcceptedFiles(file);
				const formData = new FormData();
				formData.append("file", file);
				formData.append("username", username);

				await cloudFile(formData);
				console.log("File uploaded to cloud successfully");
			} catch (error) {
				console.error("Error uploading file:", error);
			}
		};

		const uploadFileSubscription = PubSub.subscribe(
			EventTypes.UPLOAD,
			function (msg, data) {
				const { acceptedFiles, username } = data;
				handleUploadFile(acceptedFiles, username);
			}
		);

		return () => {
			PubSub.unsubscribe(uploadFileSubscription);
		};
	}, []);

	//UPLOAD TOMONGODB
	useEffect(() => {
		const uploadToServer = async () => {
			if (publicUrl && acceptedFiles) {
				try {
					const { name, type, size } = acceptedFiles;
					await file(name, type, size, username, publicUrl);
				} catch (error) {
					console.error(error);
				}
				if (uploadResult.error) {
					toast.error("error during upload...");
				} else toast.success("File Uploaded!");
			}
		};

		uploadToServer();
	}, [publicUrl]);

	useEffect(() => {
		setUserFfiles(data);
	}, [data]);

	console.log(userFiles);
	console.log(data);

	return (
		<FilesContext.Provider
			value={{
				files: userFiles,
			}}
		>
			{children}
		</FilesContext.Provider>
	);
};

export default FilesProvider;
