import { Variant, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import useUser from "../../hooks/useUser";
import { EventTypes } from "../../common";
import useCopyToClipBoard from "../../hooks/useCopyToClipBoard";
import { useGetDataToSign } from "../../hooks/useGetDataToSign";
import { useFetchFromGcs } from "../../hooks/useFetchFromGcs";
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

	const [finalsignature, setFinalSignature] = useState<ArrayBuffer>();

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
					console.log(signedData.bytes);
					const base64String = signedData.bytes;
					const binaryString = atob(base64String);

					//PDF
					// const blob = new Blob(
					// 	[
					// 		new Uint8Array(binaryString.length).map((_, i) =>
					// 			binaryString.charCodeAt(i)
					// 		),
					// 	],
					// 	{ type: "application/pdf" }
					// );
					// // console.log(blob)
					// // console.log(binaryString)

					// // Create a URL for the Blob
					// const url = URL.createObjectURL(blob);
					// // Create a downloadable link
					// const a = document.createElement("a");
					// a.href = url;
					// a.download = signedData.name;
					// a.click();

					// console.log(a);
					// URL.revokeObjectURL(url);

					// // console.log(decfile)

					//XML
					const text = new TextDecoder().decode(
						new Uint8Array(binaryString.length).map((_, i) =>
							binaryString.charCodeAt(i)
						)
					);
					const parser = new DOMParser();
					const xmlDoc = parser.parseFromString(
						text,
						"application/xml"
					);
					console.log(xmlDoc);

					const xmlString = new XMLSerializer().serializeToString(
						xmlDoc
					);
					const blob = new Blob([xmlString], {
						type: "application/xml",
					});
					const url = URL.createObjectURL(blob);
					const a = document.createElement("a");
					a.href = url;
					a.download = signedData.name;

					a.click();
					URL.revokeObjectURL(url);

					// THERE IS A BUG. SECOND UPLOAD IN AROW DOES NOT WORK.
					PubSub.publish(EventTypes.UPLOAD, {
						accfile: blob as File,
						username,
						signed: true,
						filename: signedData.name,
					});
				} catch (error) {
					console.error("Error:", error);
				}
			};
			decode();
		}
	}, [signedData]);

	// STEP 1 GET DATA.
	useEffect(() => {
		if (gcsFile) {
			const getDato = async () => {
				try {
					await getData(username, file.filename);
					console.log(data);
					if (!data) PubSub.publish(EventTypes.ACTION_FINISHED);
				} catch (error) {
					console.log(error);
				}
			};
			getDato();
		}
	}, [gcsFile]);

	// STEP 2 SIGNA DATA WITH GENERATED PRIVATE KEY.
	useEffect(() => {
		if (data) {
			const getPrivateKey = async () => {
				try {
					console.log(data);
					const encoder = new TextEncoder();
					const dataBytes = encoder.encode(data.bytes);
					window.crypto.subtle
						.generateKey(
							{
								name: "RSASSA-PKCS1-v1_5",
								modulusLength: 2048,
								publicExponent: new Uint8Array([
									0x01, 0x00, 0x01,
								]),
								hash: { name: "SHA-256" },
							},
							false,
							["sign", "verify"]
						)
						.then(function (key) {
							//returns a keypair object
							console.log(key);
							window.crypto.subtle
								.sign(
									{
										name: "RSASSA-PKCS1-v1_5",
									},
									key.privateKey,
									dataBytes
								)
								.then(function (signature) {
									//returns an ArrayBuffer containing the signature
									setFinalSignature(signature);
									window.crypto.subtle
										.verify(
											{
												name: "RSASSA-PKCS1-v1_5",
											},
											key.publicKey,
											signature,
											dataBytes
										)
										.catch(function (err) {
											console.error(err);
										});
									return signature;
								})
								.catch(function (err) {
									console.error(err);
								});
						})
						.catch(function (err) {
							console.error(err);
						});
				} catch (error) {
					console.error("Error loading private key:", error);
					return null;
				}
			};
			getPrivateKey();
		}
	}, [data]);

	// STEP 3 SIGN DOCUMENT.
	useEffect(() => {
		if (finalsignature) {
			const signDato = async () => {
				// Turn signature value into base64.
				const signatureArray = new Uint8Array(finalsignature);

				const arrayBufferToBase64 = (arrayBuffer: ArrayBuffer) => {
					const binaryArray = [];
					const bytes = new Uint8Array(arrayBuffer);
					for (let i = 0; i < bytes.byteLength; i++) {
						binaryArray.push(String.fromCharCode(bytes[i]));
					}
					const binaryString = binaryArray.join("");
					return btoa(binaryString);
				};
				const base64Signature = arrayBufferToBase64(signatureArray);
				try {
					await signData(base64Signature, username, file.filename);
				} catch (error) {
					console.log(error);
				}
			};
			signDato();
		}
	}, [finalsignature]);

	// Validate Document.
	// useEffect(() => {
	// 	if (signedData) {
	// 		const validateDato = async () => {
	// 			try {
	// 				const payloadToValidate = {
	// 					signedDocument: {
	// 						bytes: signedData.bytes, // SIGNED DOC
	// 						digestAlgorithm: null,
	// 						name: `signed-${file.filename}`, // SIGNED DOC NAME
	// 					},
	// 					originalDocuments: [
	// 						{
	// 							bytes: b64file, // ORIGINAL DOC in base 64
	// 							digestAlgorithm: null,
	// 							name: file.filename, // ORIGINAL DOC NAME
	// 						},
	// 					],
	// 					policy: null,
	// 					tokenExtractionStrategy: "NONE",
	// 					signatureId: null,
	// 				};
	// 				await validateData(payloadToValidate);
	// 				console.log(validatedData);
	// 			} catch (error) {
	// 				console.log(error);
	// 			}
	// 		};
	// 		validateDato();
	// 	}
	// }, [signedData]);

	// GET FILE.
	const handleSignDocument = async () => {
		try {
			PubSub.publish(EventTypes.ACTION_LOADING);
			await fileFetch(`${username}_${file.filename}`);
			if (gcsFile) {
				toast.error("File already signed!");
				PubSub.publish(EventTypes.ACTION_FINISHED);
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
