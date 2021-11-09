import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./lang/en.json";
import vi from "./lang/vi.json";

i18next.use(initReactI18next).init({
	lng: "vi",
	compatibilityJSON: "v3",
	debug: true,
	resources: {
		en: {
			translation: en
		},
		vi: {
			translation: vi
		}
	},
	defaultNS: "translation",
	ns: "translation",
	react: {
		useSuspense: false
	},
	fallbackLng: "vi",
	interpolation: {
		escapeValue: false
	}
});

export default i18next;
