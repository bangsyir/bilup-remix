import {
  Form,
  Link,
  useActionData,
  useSearchParams,
  useTransition,
} from "@remix-run/react";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import type { ActionArgs, LoaderArgs, MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { badRequest } from "~/helpers/badrequest.server";
import { verifyUser } from "~/models/user.server";
import {
  validateEmail,
  validatePassword,
  validateuser,
} from "~/helpers/auth/loginValidate.server";
import { createUserSession, getUserId } from "~/utils/auth.server";
import Spinner from "~/components/Spinner";
import { useEffect, useRef } from "react";
import { GoogleIcon } from "~/components/icons/google";

export async function action({ request }: ActionArgs) {
  const form = await request.formData();
  const email = form.get("email") as string;
  const password = form.get("password") as string;
  const redirectTo = form.get("redirectTo");
  const remember = form.get("remember-me");

  const errors = {
    email: validateEmail(email),
    password: validatePassword(password),
  };
  if (Object.values(errors).some(Boolean)) {
    return badRequest({ errors });
  }
  const user = await verifyUser(email, password);
  if (!user) {
    return badRequest({
      errors: {
        form: validateuser(user),
      },
    });
  }
  if (user.isVerify === false) {
    return badRequest({
      errors: {
        verify: "E-mel belum disahkan.",
      },
      user: {
        cuid: user.cuid,
      },
    });
  }
  return createUserSession({
    request,
    userId: user.id,
    remember: remember === "on" ? true : false,
    redirectTo: typeof redirectTo === "string" ? redirectTo : "/app",
  });
}

export async function loader({ request }: LoaderArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect("/app");
  return {};
}

export const meta: MetaFunction = () => ({
  title: "Masuk | App",
});

const Login = () => {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/app";
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const actionData = useActionData<typeof action>();
  const transition = useTransition();
  let isSubmit = transition.state === "submitting";

  useEffect(() => {
    if (actionData?.errors.name) {
      emailRef.current?.focus();
    } else if (actionData?.errors.password) {
      passwordRef.current?.focus();
    } else {
      emailRef.current?.focus();
    }
  }, [actionData]);

  return (
    <div className="flex min-h-full items-center justify-center pt-24 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="border bg-white py-8 px-4 rounded-md">
          <div>
            <Link to="/">
              <h1 className="text-center text-4xl font-bold font-mono cursor-pointer">
                bilup
              </h1>
            </Link>
            <h4 className="mt-4 text-center text-xl font-bold tracking-tight text-gray-900">
              Masuk ke akaun anda
            </h4>
          </div>
          {!isSubmit && actionData?.errors?.form && (
            <div className="px-4 py-2 bg-red-500 text-white rounded-md">
              {actionData?.errors?.form}
            </div>
          )}
          {!isSubmit && actionData?.errors?.verify && (
            <div className="px-4 py-2 bg-red-500 text-white rounded-md">
              {actionData?.errors?.verify}{" "}
              <Link
                to={`/request-code?id=${actionData?.user.cuid}`}
                className="bg-white px-1 rounded-md text-black"
              >
                Klik disini
              </Link>
            </div>
          )}
          <Form className="mt-8" method="post">
            <input type="hidden" name="redirectTo" value={redirectTo} />
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email
              </label>
              <input
                ref={emailRef}
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                className={`relative block w-full appearance-none rounded-md border ${
                  actionData?.errors.email
                    ? "border-red-500"
                    : "border-gray-300"
                } px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                placeholder="E-Mel"
              />
              <small className="text-red-500 p-1">
                {!isSubmit && actionData?.errors.email}
              </small>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                ref={passwordRef}
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                className={`relative block w-full appearance-none rounded-md border ${
                  actionData?.errors.password
                    ? "border-red-500"
                    : "border-gray-300"
                } px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                placeholder="Kata Laluan"
              />
              <small className="text-red-500 p-1">
                {!isSubmit && actionData?.errors.password}
              </small>
            </div>

            <div className="flex items-center justify-between pb-4">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Ingat saya
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="/forgot-password"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Lupa kata laluan?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className={`group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <LockClosedIcon
                    className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                    aria-hidden="true"
                  />
                </span>
                {isSubmit ? <Spinner /> : "Masuk"}
              </button>
            </div>
          </Form>
          <div className="text-sm text-center pt-2 flex flex-col">
            <Link
              to="/register"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Anda belum punya akaun ? sila register disini
            </Link>
            <div className="flex justify-center items-center relative py-8">
              <span className="border-t border-indigo-700 w-full absolute"></span>
              <span className="font-bold text-indigo-700 absolute bg-white rounded-full p-1">
                ATAU
              </span>
            </div>

            <button className="flex w-full justify-center items-center rounded-md border border-red-500 py-2 px-4 text-sm text-gray-700 font-medium hover:border-red-400 hover:shadow-md">
              <GoogleIcon /> &nbsp; Login dengan &nbsp;
              <b className="text-red-500">Google</b>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
