import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import clsx from "clsx";
import toast from "react-hot-toast";
import { useUploadFile } from "../../../../hooks/useUploadFile";
import useUser from "../../../../hooks/useUser";
import { useUploadFileToCloud } from "../../../../hooks/useUploadFileToCloud";

export const FileUploader: React.FC = () => {
	const { username } = useUser();

	const { result, file } = useUploadFile();

	const { res, cloudFile, publicUrl } = useUploadFileToCloud();

	const [acceptedFiles, setAcceptedFiles] = useState<any>([]);

	console.log(publicUrl);

	const onDrop = useCallback(async (acceptedFiles: Array<File>) => {
		try {
			const file = acceptedFiles[0];
			setAcceptedFiles(file);
			const formData = new FormData();
			formData.append("file", file);

			await cloudFile(formData);
			console.log("File uploaded to cloud successfully");
		} catch (error) {
			console.error("Error uploading file:", error);
		}
	}, []);

	useEffect(() => {
		const uploadToServer = async () => {
			if (publicUrl && acceptedFiles) {
				try {
					const { name, type, size } = acceptedFiles;
					await file(name, type, size, username, publicUrl);
				} catch (error) {
					console.error(error);
				}
			}
		};

		uploadToServer();
	}, [publicUrl]);

	useEffect(() => {
		if (result.success) {
			toast.success("File Uploaded!");
		} else if (result.error) toast.error("Something went wrong...");
	}, [result, publicUrl]);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
	});

	return (
		<div
			{...getRootProps()}
			className={clsx(
				"flex justify-center w-full items-center",
				`dropzone ${isDragActive ? "active" : ""}`
			)}
		>
			<input {...getInputProps()} />
			<p className="text-[#006699] font-semibold text-3xl flex-wrap px-3">
				Drag and drop files here or click to select files
			</p>
		</div>
	);
};

export default FileUploader;
