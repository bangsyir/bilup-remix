import { createCookieSessionStorage } from "@remix-run/node";
// import invariant from "tiny-invariant";

const SESSION_SECRET = "akkdkalhsd-asdak34kh3k-asdas34wsnrk3k4";
// invariant(SESSION_SECRET, "SESSION_SECRET must be set.");

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_session",
    secure: process.env.NODE_ENV === "production" ? true : false,
    secrets: [SESSION_SECRET],
    sameSite: process.env.NODE_ENV === "development" ? "strict" : "lax",
    path: "/",
    httpOnly: true,
  },
});
