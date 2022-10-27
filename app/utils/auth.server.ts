import { redirect } from "@remix-run/node";
import { getUserById, getUserDetails } from "~/models/user.server";
import { sessionStorage } from "./session.server";

const USER_SESSION_KEY = "_appid";

// find session from browser
export const getSession = (request: Request) => {
	const cookie = request.headers.get("cookie");
	return sessionStorage.getSession(cookie);
};

export const getUserId = async (request: Request) => {
	const session = await getSession(request);
	const userId = session.get(USER_SESSION_KEY) || session.get("user")?._appid;
	return userId;
};

export const getUser = async (request: Request) => {
	const userId = await getUserId(request);
	if (userId === undefined) return null;
	const user = await getUserById(userId);
	if (user) return user;
	throw await logout(request);
};

export const requireUserId = async (
	request: Request,
	redirectTo: string = new URL(request.url).pathname
) => {
	const userId = await getUserId(request);
	if (!userId) {
		const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
		throw redirect(`/login?${searchParams}`);
	}

	return userId;
};

export const requireUser = async (request: Request) => {
	const userId = await requireUserId(request);
	const user = await getUserById(userId);
	if (user) return user;
	throw await logout(request);
};

export const getAllUser = async (request: Request) => {
	const userId = await requireUserId(request);
	const user = await getUserDetails(userId);
	if (!user) throw await logout(request);
	return user;
};

export const createUserSession = async ({
	request,
	userId,
	remember,
	redirectTo,
}: {
	request: Request;
	userId: number;
	remember: Boolean;
	redirectTo: string;
}) => {
	const session = await getSession(request);
	session.set(USER_SESSION_KEY, userId);
	return redirect(redirectTo, {
		headers: {
			"Set-Cookie": await sessionStorage.commitSession(session, {
				maxAge: remember ? 60 * 60 * 24 * 7 : undefined,
			}),
		},
	});
};

export const logout = async (request: Request) => {
	const session = await getSession(request);
	return redirect("/", {
		headers: {
			"Set-Cookie": await sessionStorage.destroySession(session),
		},
	});
};
