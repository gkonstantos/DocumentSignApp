import { Variant, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import useUser from "../../hooks/useUser";
import { EventTypes } from "../../common";
import useCopyToClipBoard from "../../hooks/useCopyToClipBoard";
import { useGetDataToSign } from "../../hooks/useGetDataToSign";
import { useFetchFromGcs } from "../../hooks/useFetchFromGcs";
import { blobToBase64, base64ToFile } from "file64";
import { useSignData } from "../../hooks/useSignData";
import { useValidateData } from "../../hooks/useValidateData";
import { useTranslation } from "react-i18next";

type AllDocumentProps = {
	initial?: Variant;
	animate?: Variant;
	exit?: Variant;
	file: any;
};

export const AllDocument: React.FC<AllDocumentProps> = (props) => {
	const { initial, animate, exit, file } = props;

	const { username } = useUser();
	const { t } = useTranslation();

	const { copy } = useCopyToClipBoard();

	const { getData, data } = useGetDataToSign();
	const { signData, signedData } = useSignData();
	const { validateData, validatedData } = useValidateData();

	const { fileFetch, gcsFile } = useFetchFromGcs();

	const [b64file, setB64file] = useState<string>("");

	const handleDelete = useCallback((fileToDelete: any) => {
		PubSub.publish(EventTypes.DELETE_FILE, {
			fileToDelete,
			username,
		});
	}, []);

	const onClick = useCallback(() => {
		if (copy(file.path)) toast.success("Link copied!");
		else toast.error("Something went wrong...");
	}, [copy, file.path]);

	// DOWNLOAD SIGNED FILE AND SAVE TO DB.
	useEffect(() => {
		if (signedData) {
			const decode = async () => {
				try {
					const decfile = await base64ToFile(
						signedData.bytes,
						signedData.name
					);
					console.log(signedData);
					console.log(decfile);
					PubSub.publish(EventTypes.UPLOAD, {
						accfile: decfile,
						username,
						signed: true,
					});

					// Create a Blob with the decoded data
					const blob = new Blob([decfile]);
					// Generate a URL for the Blob
					const fileUrl = URL.createObjectURL(blob);
					const downloadLink = document.createElement("a");
					downloadLink.href = fileUrl;
					downloadLink.download = `${signedData.name}`;
					downloadLink.click();
					URL.revokeObjectURL(fileUrl);
				} catch (error) {
					console.error("Error:", error);
				}
			};
			decode();
		}
	}, [validatedData]);

	// GET DATA.
	useEffect(() => {
		if (gcsFile) {
			// console.log(gcsFile); // This will log the updated gcsFile value
			const getDato = async () => {
				try {
					const bbb = new Blob([gcsFile], {
						type: "application/pdf",
					});

					const b64 = await blobToBase64(bbb);

					// need this to get only the base64 part.
					const testba64 = b64.split(",")[1];
					setB64file(testba64);

					const payload = {
						parameters: {
							signingCertificate: {
								encodedCertificate:
									"MIIC6jCCAdKgAwIBAgIGLtYU17tXMA0GCSqGSIb3DQEBCwUAMDAxGzAZBgNVBAMMElJvb3RTZWxmU2lnbmVkRmFrZTERMA8GA1UECgwIRFNTLXRlc3QwHhcNMTcwNjA4MTEyNjAxWhcNNDcwNzA0MDc1NzI0WjAoMRMwEQYDVQQDDApTaWduZXJGYWtlMREwDwYDVQQKDAhEU1MtdGVzdDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMI3kZhtnipn+iiZHZ9ax8FlfE5Ow/cFwBTfAEb3R1ZQUp6/BQnBt7Oo0JWBtc9qkv7JUDdcBJXPV5QWS5AyMPHpqQ75Hitjsq/Fzu8eHtkKpFizcxGa9BZdkQjh4rSrtO1Kjs0Rd5DQtWSgkeVCCN09kN0ZsZ0ENY+Ip8QxSmyztsStkYXdULqpwz4JEXW9vz64eTbde4vQJ6pjHGarJf1gQNEc2XzhmI/prXLysWNqC7lZg7PUZUTrdegABTUzYCRJ1kWBRPm4qo0LN405c94QQd45a5kTgowHzEgLnAQI28x0M3A59TKC+ieNc6VF1PsTLpUw7PNI2VstX5jAuasCAwEAAaMSMBAwDgYDVR0PAQH/BAQDAgEGMA0GCSqGSIb3DQEBCwUAA4IBAQCK6LGA01TR+rmU8p6yhAi4OkDN2b1dbIL8l8iCMYopLCxx8xqq3ubZCOxqh1X2j6pgWzarb0b/MUix00IoUvNbFOxAW7PBZIKDLnm6LsckRxs1U32sC9d1LOHe3WKBNB6GZALT1ewjh7hSbWjftlmcovq+6eVGA5cvf2u/2+TkKkyHV/NR394nXrdsdpvygwypEtXjetzD7UT93Nuw3xcV8VIftIvHf9LjU7h+UjGmKXG9c15eYr3SzUmv6kyOI0Bvw14PWtsWGl0QdOSRvIBBrP4adCnGTgjgjk9LTcO8B8FKrr+8lHGuc0bp4lIUToiUkGILXsiEeEg9WAqm+XqO",
							},
							certificateChain: [],
							detachedContents: null,
							asicContainerType: null,
							signatureLevel: "XAdES_BASELINE_B",
							signaturePackaging: "ENVELOPING",
							embedXML: false,
							manifestSignature: false,
							jwsSerializationType: null,
							sigDMechanism: null,
							signatureAlgorithm: "RSA_SHA256",
							digestAlgorithm: "SHA256",
							encryptionAlgorithm: "RSA",
							referenceDigestAlgorithm: null,
							maskGenerationFunction: null,
							contentTimestamps: null,
							contentTimestampParameters: {
								digestAlgorithm: "SHA256",
								canonicalizationMethod:
									"http://www.w3.org/2001/10/xml-exc-c14n#",
								timestampContainerForm: null,
							},
							signatureTimestampParameters: {
								digestAlgorithm: "SHA256",
								canonicalizationMethod:
									"http://www.w3.org/2001/10/xml-exc-c14n#",
								timestampContainerForm: null,
							},
							archiveTimestampParameters: {
								digestAlgorithm: "SHA256",
								canonicalizationMethod:
									"http://www.w3.org/2001/10/xml-exc-c14n#",
								timestampContainerForm: null,
							},
							signWithExpiredCertificate: false,
							generateTBSWithoutCertificate: false,
							imageParameters: null,
							signatureIdToCounterSign: null,
							blevelParams: {
								trustAnchorBPPolicy: true,
								signingDate: 1675669784752,
								claimedSignerRoles: null,
								policyId: null,
								policyQualifier: null,
								policyDescription: null,
								policyDigestAlgorithm: null,
								policyDigestValue: null,
								policySpuri: null,
								commitmentTypeIndications: null,
								signerLocationPostalAddress: [],
								signerLocationPostalCode: null,
								signerLocationLocality: null,
								signerLocationStateOrProvince: null,
								signerLocationCountry: null,
								signerLocationStreet: null,
							},
						},
						toSignDocument: {
							bytes: testba64,
							digestAlgorithm: null,
							name: `signed-${file.filename}`,
						},
					};

					await getData(payload);
					console.log(data);
				} catch (error) {
					console.log(error);
				}
			};
			getDato();
		}
	}, [gcsFile]);

	// SIGN DATA.
	useEffect(() => {
		if (data) {
			const signDato = async () => {
				try {
					const payloadToSign = {
						parameters: {
							signingCertificate: {
								encodedCertificate:
									"MIIC6jCCAdKgAwIBAgIGLtYU17tXMA0GCSqGSIb3DQEBCwUAMDAxGzAZBgNVBAMMElJvb3RTZWxmU2lnbmVkRmFrZTERMA8GA1UECgwIRFNTLXRlc3QwHhcNMTcwNjA4MTEyNjAxWhcNNDcwNzA0MDc1NzI0WjAoMRMwEQYDVQQDDApTaWduZXJGYWtlMREwDwYDVQQKDAhEU1MtdGVzdDCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAMI3kZhtnipn+iiZHZ9ax8FlfE5Ow/cFwBTfAEb3R1ZQUp6/BQnBt7Oo0JWBtc9qkv7JUDdcBJXPV5QWS5AyMPHpqQ75Hitjsq/Fzu8eHtkKpFizcxGa9BZdkQjh4rSrtO1Kjs0Rd5DQtWSgkeVCCN09kN0ZsZ0ENY+Ip8QxSmyztsStkYXdULqpwz4JEXW9vz64eTbde4vQJ6pjHGarJf1gQNEc2XzhmI/prXLysWNqC7lZg7PUZUTrdegABTUzYCRJ1kWBRPm4qo0LN405c94QQd45a5kTgowHzEgLnAQI28x0M3A59TKC+ieNc6VF1PsTLpUw7PNI2VstX5jAuasCAwEAAaMSMBAwDgYDVR0PAQH/BAQDAgEGMA0GCSqGSIb3DQEBCwUAA4IBAQCK6LGA01TR+rmU8p6yhAi4OkDN2b1dbIL8l8iCMYopLCxx8xqq3ubZCOxqh1X2j6pgWzarb0b/MUix00IoUvNbFOxAW7PBZIKDLnm6LsckRxs1U32sC9d1LOHe3WKBNB6GZALT1ewjh7hSbWjftlmcovq+6eVGA5cvf2u/2+TkKkyHV/NR394nXrdsdpvygwypEtXjetzD7UT93Nuw3xcV8VIftIvHf9LjU7h+UjGmKXG9c15eYr3SzUmv6kyOI0Bvw14PWtsWGl0QdOSRvIBBrP4adCnGTgjgjk9LTcO8B8FKrr+8lHGuc0bp4lIUToiUkGILXsiEeEg9WAqm+XqO",
							},
							certificateChain: [],
							detachedContents: null,
							asicContainerType: null,
							signatureLevel: "XAdES_BASELINE_B",
							signaturePackaging: "ENVELOPING",
							embedXML: false,
							manifestSignature: false,
							jwsSerializationType: null,
							sigDMechanism: null,
							signatureAlgorithm: "RSA_SHA256",
							digestAlgorithm: "SHA256",
							encryptionAlgorithm: "RSA",
							referenceDigestAlgorithm: null,
							maskGenerationFunction: null,
							contentTimestamps: null,
							contentTimestampParameters: {
								digestAlgorithm: "SHA256",
								canonicalizationMethod:
									"http://www.w3.org/2001/10/xml-exc-c14n#",
								timestampContainerForm: null,
							},
							signatureTimestampParameters: {
								digestAlgorithm: "SHA256",
								canonicalizationMethod:
									"http://www.w3.org/2001/10/xml-exc-c14n#",
								timestampContainerForm: null,
							},
							archiveTimestampParameters: {
								digestAlgorithm: "SHA256",
								canonicalizationMethod:
									"http://www.w3.org/2001/10/xml-exc-c14n#",
								timestampContainerForm: null,
							},
							signWithExpiredCertificate: false,
							generateTBSWithoutCertificate: false,
							imageParameters: null,
							signatureIdToCounterSign: null,
							blevelParams: {
								trustAnchorBPPolicy: true,
								signingDate: 1675669784752,
								claimedSignerRoles: null,
								policyId: null,
								policyQualifier: null,
								policyDescription: null,
								policyDigestAlgorithm: null,
								policyDigestValue: null,
								policySpuri: null,
								commitmentTypeIndications: null,
								signerLocationPostalAddress: [],
								signerLocationPostalCode: null,
								signerLocationLocality: null,
								signerLocationStateOrProvince: null,
								signerLocationCountry: null,
								signerLocationStreet: null,
							},
						},
						signatureValue: {
							algorithm: "RSA_SHA256",
							value: "qltCBsUmABDy+dkTe0h0z//D7jZ9oJxWMlKIvFuG/TOu+HXU0ouGy9c+nQ5mmO0zEvOQx6ECcY2PP+aiklGTDitsd4mjH81stS4MnDiuzODlckypnyiIVh5drmksAfj1oUj/WLDHeMMP/UmIVZ/FoFZe5mnCuzIkbH+eLVlwr978gLw8GGJEK0kfzmDz17O7XgJXF+yA1887hV651hOy0tStVx6XY+g2ImO8Qi9pDHCORLt/Ab2d3FztzFK9TCa5KS7m0ZjhsRsUophxNes23cTYop3M6VqD/+bXsGGOlRsBxTk2sWLRwXRAEdav0SHLig+DZAFGgtRQSmv0fnODkQ==",
						},
						toSignDocument: {
							bytes: data.bytes,
							digestAlgorithm: null,
							name: `signed-${file.filename}`,
						},
					};
					await signData(payloadToSign);
				} catch (error) {
					console.log(error);
				}
			};
			signDato();
		}
	}, [data]);

	// VALIDATE DATA.
	useEffect(() => {
		if (signedData) {
			const validateDato = async () => {
				try {
					const payloadToValidate = {
						signedDocument: {
							bytes: signedData.bytes, // SIGNED DOC
							digestAlgorithm: null,
							name: `signed-${file.filename}`, // SIGNED DOC NAME
						},
						originalDocuments: [
							{
								bytes: b64file, // ORIGINAL DOC in base 64
								digestAlgorithm: null,
								name: file.filename, // ORIGINAL DOC NAME
							},
						],
						policy: null,
						tokenExtractionStrategy: "NONE",
						signatureId: null,
					};
					await validateData(payloadToValidate);
					console.log(validatedData);
				} catch (error) {
					console.log(error);
				}
			};
			validateDato();
		}
	}, [signedData]);

	// GET FILE.
	const handleSignDocument = async () => {
		try {
			await fileFetch(`${username}_${file.filename}`);
			if (gcsFile) {
				toast.error("File already signed!");
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<motion.div
			className="w-full px-5 space-x-5 flex items-center justify-between h-10 rounded-3xl bg-[#FAFBFF]"
			variants={{
				initial: initial ?? {},
				animate: animate ?? {},
				exit: exit ?? {},
			}}
		>
			<p className="">{file && file.filename}</p>
			<div className="flex space-x-7 text-[#006699]">
				<motion.button
					onClick={() => window.open(file.path)}
					whileTap={{ scale: 0.9 }}
				>
					{t("ALL_DOCUMENT.OPEN")}
				</motion.button>
				{file.signed === false && (
					<motion.button
						onClick={handleSignDocument}
						whileTap={{ scale: 0.9 }}
					>
						{t("ALL_DOCUMENT.SIGN")}
					</motion.button>
				)}

				<motion.button whileTap={{ scale: 0.9 }} onClick={onClick}>
					{t("ALL_DOCUMENT.SHARE")}
				</motion.button>
				<motion.button
					whileTap={{ scale: 0.9 }}
					onClick={() => handleDelete(file)}
				>
					{t("ALL_DOCUMENT.DELETE")}
				</motion.button>
			</div>
		</motion.div>
	);
};

export default AllDocument;
