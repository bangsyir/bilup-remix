import validator from "validator";
import { containsWhiteSpace } from "~/utils/text.server";

export function validateName(name: string) {
  if (typeof name !== "string" || name.length === 0) {
    return "Nama diperlukan.";
  }
  if (name.length < 6) {
    return "Nama terlalu pendek. min panjang 6 aksara";
  }
}

export function validateUsername(username: string) {
  if (typeof username !== "string" || username.length === 0) {
    return "username diperlukan.";
  }
  if (username.length < 6) {
    return "username terlalu pendek, min panjang 6 aksara.";
  }
  if (containsWhiteSpace(username)) {
    return "Username tak boleh berjara.";
  }
}
export function validateEmail(email: string) {
  if (typeof email !== "string" || email.length === 0) {
    return "Email diperlukan";
  }
  if (!validator.isEmail(email)) {
    return "E-mel tidak sah.";
  }
}

export function validatePassword(password: string) {
  if (typeof password !== "string" || password.length === 0) {
    return "Kata laluan diperlukan";
  }
  if (password.length < 8) {
    return "Kata laluan terlalu pendek, min panjang 8 aksara.";
  }
}

export function validateRetypePassword(password: string, rPassword: string) {
  if (rPassword !== password) {
    return "Kata laluan tidak sepadan.";
  }
}
