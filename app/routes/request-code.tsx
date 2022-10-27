import type { LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { setVerifyCode } from "~/models/user.server";

// export async function action({ request }: ActionArgs) {
// 	const url = new URL(request.url);
// 	const searchId = url.searchParams.get("id") as string;

// 	const setVerify = setVerifyCode(searchId, "rgt");

// 	// send to email

// 	return redirect(`/verify-email?id=${searchId}`);
// }

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const searchId = url.searchParams.get("id") as string;
  setVerifyCode(searchId, "rgt");
  // send email
  return redirect(`/verify-email?id=${searchId}`);
}
