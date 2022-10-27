import bcrypt from "@node-rs/bcrypt";

export async function ComparePassword(i: string, hash: string) {
  const compare = await bcrypt.verify(i, hash);
  return compare;
}
