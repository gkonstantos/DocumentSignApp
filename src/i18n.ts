import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";

i18n
	.use(initReactI18next)
	.use(Backend)
	.init({
		debug: false,
		fallbackLng: "en",
		supportedLngs: ["en", "gr"],
		ns: ["translation"],
		defaultNS: "translation",
		backend: {
			allowMultiLoading: true,
			loadPath: `/locales/{{lng}}/{{ns}}.json`,
		},
	});

export default i18n;
