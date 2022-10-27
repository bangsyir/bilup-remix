import validator from "validator";

export function validateEmail(email: string) {
	if (typeof email !== "string" || email.length === 0) {
		return "E-mel diperlukan";
	}
	if (!validator.isEmail(email)) {
		return "Format e-mel tidak sah.";
	}
}
export function validatePassword(password: string) {
	if (typeof password !== "string" || password.length === 0) {
		return "Kata laluan diperlukan";
	}
}

export function validateuser(user: any) {
	if (!user) {
		return "Kesalahan pada email atau password";
	}
}
