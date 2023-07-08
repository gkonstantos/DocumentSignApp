import AnimatedTypography from "../../components/AnimatedTypography";
import FileUploader from "./components/FileUploader";

export const UploadPage: React.FC = () => {
	return (
		<div className="h-full w-full flex flex-col items-center">
			<p className="text-[#006699] font-semibold text-4xl py-3 text-center">
				Upload Documents
			</p>
			<div className="bg-[#FAFBFF] w-9/12 h-5/6 rounded-3xl flex justify-center my-5">
				<FileUploader />
			</div>
		</div>
	);
};

export default UploadPage;
