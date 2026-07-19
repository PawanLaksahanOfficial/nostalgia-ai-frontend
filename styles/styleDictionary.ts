import { homePage } from "./homePage";
import { inputField } from "./inputField";
import { textArea } from "./textArea";
import { header } from "./header";
import { footer } from "./footer";
import { login } from "./login";
import { videoPreview } from "./vedioPreview";
import { register } from "./register";
import { profile } from "./profile";
import { errorPage } from "./errorPage";

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
    styleDictionary.set("errorPage", errorPage)
