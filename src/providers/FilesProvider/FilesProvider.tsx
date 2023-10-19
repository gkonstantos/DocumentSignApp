import { useState, useEffect } from "react";
import { EventTypes } from "../../common";
import { FilesContext } from "../../context/FilesContext/context";
import useGetFiles from "../../hooks/useGetFiles";
import useUser from "../../hooks/useUser";
import useDeleteFile from "../../hooks/useDeleteFile";
import toast from "react-hot-toast";
import useUploadFileToCloud from "../../hooks/useUploadFileToCloud";
import useUploadFile from "../../hooks/useUploadFile";
import { useFetchFromGcs } from "../../hooks/useFetchFromGcs";
import { useTranslation } from "react-i18next";

export const FilesProvider: React.FC<React.PropsWithChildren> = ({
	children,
}) => {
	const { files, data } = useGetFiles();
	const { username } = useUser();
	const { t } = useTranslation();

	const [userFiles, setUserFfiles] = useState<Array<any>>([]);
	const [acceptedFiles, setAcceptedFiles] = useState<any>([]);

	const { fileDelete, result } = useDeleteFile();

	const { fileFetch } = useFetchFromGcs();

	const { res, cloudFile, publicUrl } = useUploadFileToCloud();
	const { uploadResult, file } = useUploadFile();

	const [signed, setSigned] = useState<boolean>(false);

	const [filenamee, setFilename] = useState<string>("");

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
				toast.success(t("TOAST.FILE_DELETED"));
			} catch (error) {
				console.error(error);
				toast.error(t("TOAST.SOMETHING_WENT_WRONG"));
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

	// FETCH FROM GCS.
	useEffect(() => {
		const handleFetchFile = async (file: any, username: string) => {
			try {
				await fileFetch(`${username}_${file.filename}`);
			} catch (error) {
				console.error(error);
			}
		};

		const subscr = PubSub.subscribe(
			EventTypes.FETCH_FILE,
			function (msg, data) {
				const { file, username } = data;
				handleFetchFile(file, username);
			}
		);

		return () => {
			PubSub.unsubscribe(subscr);
		};
	}, []);

	//UPLOAD TO GCS.
	useEffect(() => {
		const handleUploadFile = async (
			accfile: any,
			username: string,
			signed: boolean,
			filename: string
		) => {
			try {
				const file = accfile;
				setAcceptedFiles(file);
				setSigned(signed);
				setFilename(filename);
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
				const { accfile, username, signed, filename } = data;
				handleUploadFile(accfile, username, signed, filename);
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
					name
						? await file(
								name,
								type,
								size,
								username,
								publicUrl,
								signed
						  )
						: await file(
								filenamee,
								type,
								size,
								username,
								publicUrl,
								signed
						  );
				} catch (error) {
					console.error(error);
				}
				if (uploadResult.success === true) {
					// toast.success(t("File signed!"));
					PubSub.publish(EventTypes.REFRESH);
				}
				if (uploadResult.error) {
					toast.error(t("TOAST.ERROR_DURING_UPLOAD"));
				} else if (signed === false) {
					toast.success(t("TOAST.FILE_UPLOADED"));
				}

				PubSub.publish(EventTypes.ACTION_FINISHED);
			}
		};

		uploadToServer();
	}, [publicUrl]);

	useEffect(() => {
		setUserFfiles(data);
	}, [data]);

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
