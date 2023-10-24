import { Variant, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import useUser from "../../hooks/useUser";
import { EventTypes } from "../../common";
import useCopyToClipBoard from "../../hooks/useCopyToClipBoard";
import { useGetDataToSign } from "../../hooks/useGetDataToSign";
import { useFetchFromGcs } from "../../hooks/useFetchFromGcs";
import { useSignData } from "../../hooks/useSignData";
import { useTranslation } from "react-i18next";
import axios from "axios";

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
	const { fileFetch, gcsFile } = useFetchFromGcs();

	const [privateKey, setPrivateKey] = useState("");
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
					const base64String = signedData.bytes;
					const binaryString = atob(base64String);

					//PDF
					const blob = new Blob(
						[
							new Uint8Array(binaryString.length).map((_, i) =>
								binaryString.charCodeAt(i)
							),
						],
						{ type: "application/pdf" }
					);

					// Create a URL for the Blob
					const url = URL.createObjectURL(blob);
					// Create a downloadable link
					const a = document.createElement("a");
					a.href = url;
					a.download = signedData.name;
					a.click();
					URL.revokeObjectURL(url);

					//XML. NEED TO CHANGE signatureLevel TO XAdES_BASELINE_B TO WORK.
					// const text = new TextDecoder().decode(
					// 	new Uint8Array(binaryString.length).map((_, i) =>
					// 		binaryString.charCodeAt(i)
					// 	)
					// );
					// const parser = new DOMParser();
					// const xmlDoc = parser.parseFromString(
					// 	text,
					// 	"application/xml"
					// );
					// console.log(xmlDoc);
					// const xmlString = new XMLSerializer().serializeToString(
					// 	xmlDoc
					// );
					// const blob = new Blob([xmlString], {
					// 	type: "application/xml",
					// });
					// const url = URL.createObjectURL(blob);
					// const a = document.createElement("a");
					// a.href = url;
					// a.download = signedData.name;
					// a.click();
					// URL.revokeObjectURL(url);

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
					if (!data) PubSub.publish(EventTypes.ACTION_FINISHED);
				} catch (error) {
					console.log(error);
				}
			};
			getDato();
		}
	}, [gcsFile]);

	// GET PK.
	useEffect(() => {
		// Make an HTTP request to the server endpoint
		const getpk = async () => {
			try {
				if (data) {
					const resp = await axios.get(
						"http://localhost:5173/privatekey"
					);
					setPrivateKey(resp.data);
				}
			} catch (error) {
				console.log(error);
			}
		};
		getpk();
	}, [data]);

	// STEP 2 SIGN DATA WITH GENERATED PRIVATE KEY.
	useEffect(() => {
		if (data && privateKey) {
			const getPrivateKey = async () => {
				try {
					const str2ab = (str: any) => {
						const buf = new ArrayBuffer(str.length);
						const bufView = new Uint8Array(buf);
						for (let i = 0, strLen = str.length; i < strLen; i++) {
							bufView[i] = str.charCodeAt(i);
						}
						return buf;
					};

					const binaryDerString = window.atob(privateKey);
					const binaryDer = str2ab(binaryDerString);

					const encoder = new TextEncoder();
					const dataBytes = encoder.encode(data.bytes);
					// import pem key in order to get correct format for sign.
					window.crypto.subtle
						.importKey(
							"pkcs8",
							binaryDer,
							{
								name: "RSASSA-PKCS1-v1_5",
								hash: { name: "SHA-256" },
							},
							true,
							["sign"]
						)
						.then(function (importedKey) {
							//returns private key.
							window.crypto.subtle
								.sign(
									{
										name: "RSASSA-PKCS1-v1_5",
									},
									importedKey,
									dataBytes
								)
								.then(function (signature) {
									//returns an ArrayBuffer containing the signature
									setFinalSignature(signature);
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
	}, [privateKey]);

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
					// add he signature to the file to get the signed doc.
					await signData(base64Signature, username, file.filename);
				} catch (error) {
					console.log(error);
				}
			};
			signDato();
		}
	}, [finalsignature]);

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
