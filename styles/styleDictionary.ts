import { homePage } from "./homePage";
import { inputField } from "./inputField";
import { textArea } from "./textArea";
import { header } from "./header";
import { footer } from "./footer";
import { login } from "./login";
import { videoPreview } from "./vedioPreview";
import { register } from "./register";
import { profile } from "./profile";
import { pricing } from "./pricing";
import { errorPage } from "./errorPage";
import { button } from "./button";
import { themeToggle } from "./themeToggle";
import { toastContainer } from "./toastContainer";
import { videosPage } from "./videosPage";
import { watchPage } from "./watchPage";
import { modal } from "./modal";
import { shareModal } from "./shareModal";
import { videoCard } from "./videoCard";
import { authBrand } from "./authBrand";
import { legalPage } from "./legalPage";

type StyleVariant = Record<string, Record<string, string | number | object>>;

type PageStyle = {
    mobile?: StyleVariant;
    desktop?: StyleVariant;
}

export const styleDictionary = new Map<string, PageStyle>();
    styleDictionary.set("homePage", homePage);
    styleDictionary.set("inputField", inputField);
    styleDictionary.set("textArea", textArea);
    styleDictionary.set("header", header);
    styleDictionary.set("footer", footer);
    styleDictionary.set("videoPreview", videoPreview);
    styleDictionary.set("login", login);
    styleDictionary.set("register", register)
    styleDictionary.set("profile", profile)
    styleDictionary.set("pricing", pricing)
    styleDictionary.set("errorPage", errorPage)
    styleDictionary.set("button", button)
    styleDictionary.set("themeToggle", themeToggle)
    styleDictionary.set("toastContainer", toastContainer)
    styleDictionary.set("videosPage", videosPage)
    styleDictionary.set("watchPage", watchPage)
    styleDictionary.set("modal", modal)
    styleDictionary.set("shareModal", shareModal)
    styleDictionary.set("videoCard", videoCard)
    styleDictionary.set("authBrand", authBrand)
    styleDictionary.set("legalPage", legalPage)
