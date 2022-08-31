import { createI18n } from "vue-i18n";
import messages from "@/locale";

const defaultLocale = "en";
const cachedLocale = window.localStorage.getItem("locale");
const locale = cachedLocale || defaultLocale;

export default createI18n({
  legacy: false,
  locale,
  warnHtmlMessage: false,
  fallbackLocale: defaultLocale,
  messages,
});
