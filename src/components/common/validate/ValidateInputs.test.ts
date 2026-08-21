import { describe, it, expect } from "vitest";
import { validateText, validateEmail, validatePassword, validateConfirmPassword } from "./ValidateInputs";
import { formErrorTexts } from "../../Enums/CommonTexts";

describe("validateText", () => {
    it("accepts letters, spaces, and hyphens", () => {
        expect(validateText("Mary-Jane Watson")).toEqual({ valid: true });
    });

    it("rejects an empty value", () => {
        expect(validateText("")).toEqual({ valid: false, invalid: true, message: formErrorTexts.emptyField });
    });

    it("rejects digits and other symbols", () => {
        expect(validateText("Jane99")).toEqual({ valid: false, invalid: true, message: formErrorTexts.invalidText });
    });
});

describe("validateEmail", () => {
    it("accepts a well-formed email", () => {
        expect(validateEmail("jane@example.com")).toEqual({ valid: true });
    });

    it("rejects an empty value", () => {
        expect(validateEmail("")).toEqual({ valid: false, invalid: true, message: formErrorTexts.emptyField });
    });

    it("rejects a value with no @ or domain", () => {
        expect(validateEmail("not-an-email")).toEqual({ valid: false, invalid: true, message: formErrorTexts.invalidEmail });
    });

    it("rejects a value missing a top-level domain", () => {
        expect(validateEmail("jane@example")).toEqual({ valid: false, invalid: true, message: formErrorTexts.invalidEmail });
    });
});

describe("validatePassword", () => {
    it("accepts a password with a letter, a digit, a special character, and 8+ length", () => {
        expect(validatePassword("Password1!")).toEqual({ valid: true });
    });

    it("rejects an empty value", () => {
        expect(validatePassword("")).toEqual({ valid: false, invalid: true, message: formErrorTexts.emptyField });
    });

    it("rejects a password shorter than 8 characters", () => {
        expect(validatePassword("Pw1!")).toEqual({ valid: false, invalid: true, message: formErrorTexts.invalidPassword });
    });

    it("rejects a password with no digit", () => {
        expect(validatePassword("Password!")).toEqual({ valid: false, invalid: true, message: formErrorTexts.invalidPassword });
    });

    it("rejects a password with no special character", () => {
        expect(validatePassword("Password1")).toEqual({ valid: false, invalid: true, message: formErrorTexts.invalidPassword });
    });

    it("rejects a password with no letter", () => {
        expect(validatePassword("12345678!")).toEqual({ valid: false, invalid: true, message: formErrorTexts.invalidPassword });
    });
});

describe("validateConfirmPassword", () => {
    it("accepts a value that matches the password", () => {
        expect(validateConfirmPassword("Password1!", "Password1!")).toEqual({ valid: true });
    });

    it("rejects an empty value", () => {
        expect(validateConfirmPassword("", "Password1!")).toEqual({ valid: false, invalid: true, message: formErrorTexts.emptyField });
    });

    it("rejects a value that does not match the password", () => {
        expect(validateConfirmPassword("Different1!", "Password1!")).toEqual({
            valid: false,
            invalid: true,
            message: formErrorTexts.passwordsDoNotMatch,
        });
    });
});
