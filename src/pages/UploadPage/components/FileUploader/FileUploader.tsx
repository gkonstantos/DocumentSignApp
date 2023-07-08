import React, { useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import clsx from "clsx";
import toast from "react-hot-toast";
import { useUploadFile } from "../../../../hooks/useUploadFile";
import useUser from "../../../../hooks/useUser";
import axios from "axios";

export const FileUploader: React.FC = () => {

	const { username } = useUser();

	const {result, file} = useUploadFile();

	const onDrop = useCallback(async(acceptedFiles:Array<File>) => {

		try {
			const file = acceptedFiles[0];
			const { name } = file;
	
			await axios.post('http://localhost:5173/upload', {
			  file,
			  name,
			});
		
			console.log('File uploaded successfully');
		  } catch (error) {
			console.error('Error uploading file:', error);
		  }
		// try {
		// 	const files = acceptedFiles[0];
		// 	const { name, type, size } = files;
		// 	 await file(name, type, size, username);
		// } catch (error) {
		// 	console.error(error);
		// }
		console.log(acceptedFiles[0]);
	}, []);

	useEffect(() => {
		if (result.success) {
			toast.success("File Uploaded!")
		}else if(result.error) toast.error("Something went wrong...")
	}, [result.success]);	
	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop
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
