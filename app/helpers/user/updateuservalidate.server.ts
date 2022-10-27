import { containsWhiteSpace } from "~/utils/text.server";

export const validateName = (name: string) => {
  if (typeof name !== "string" || name.length === 0) {
    return "Nama diperlukan.";
  }
  if (name.length < 6) {
    return "Nama terlalu pendek. min panjang 6 aksara";
  }
};

export const validateUsername = (username: string) => {
  if (typeof username !== "string" || username.length === 0) {
    return "Username diperlukan.";
  }
  if (username.length < 6) {
    return "Username terlalu pendek. min panjang 6 aksara";
  }
  if (containsWhiteSpace(username)) {
    return "Username tak boleh ada jarak.";
  }
};
