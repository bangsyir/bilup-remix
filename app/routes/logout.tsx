import { ActionArgs, LoaderArgs, redirect } from "@remix-run/node";
import { logout } from "~/utils/auth.server";

export async function action({ request }: ActionArgs) {
	return logout(request);
}

export async function loader({ request }: LoaderArgs) {
	return redirect("/login");
}
