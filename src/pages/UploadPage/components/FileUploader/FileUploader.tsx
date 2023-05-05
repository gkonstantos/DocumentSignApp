import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import clsx from "clsx";
import { AnimatedTypography } from "../../../../components/AnimatedTypography";
import toast from "react-hot-toast";

export const FileUploader: React.FC = () => {
	const onDrop = useCallback((acceptedFiles: File[]) => {
		// Upload files here
		console.log(acceptedFiles);
		toast.success("File Uploaded!")
	}, []);

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
			<AnimatedTypography className="text-[#006699] font-semibold text-3xl flex-wrap px-3">
				Drag and drop files here or click to select files
			</AnimatedTypography>
		</div>
	);
};

export default FileUploader;
