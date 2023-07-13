import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import clsx from "clsx";
import useUser from "../../../../hooks/useUser";
import { EventTypes } from "../../../../common";

export const FileUploader: React.FC = () => {
	const { username } = useUser();

	const onDrop = useCallback((acceptedFiles: Array<File>) => {
		PubSub.publish(EventTypes.UPLOAD, {
			acceptedFiles,
			username,
		});
	}, []);

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
