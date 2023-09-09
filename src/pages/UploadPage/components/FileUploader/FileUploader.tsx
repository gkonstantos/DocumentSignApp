import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import clsx from "clsx";
import useUser from "../../../../hooks/useUser";
import { EventTypes } from "../../../../common";
import { useTranslation } from "react-i18next";

export const FileUploader: React.FC = () => {
	const { username } = useUser();
	const { t } = useTranslation();

	const onDrop = useCallback((acceptedFiles: any) => {
		PubSub.publish(EventTypes.ACTION_LOADING);
		PubSub.publish(EventTypes.UPLOAD, {
			accfile: acceptedFiles[0],
			username,
			signed: false,
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
				{t("UPLOAD_PAGE.FILE_UPLOADER_TEXT")}
			</p>
		</div>
	);
};

export default FileUploader;
