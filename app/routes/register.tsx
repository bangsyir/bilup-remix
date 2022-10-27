import {
  EnvelopeIcon,
  EyeSlashIcon,
  LockClosedIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import type { ActionArgs, MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, Link, useActionData, useTransition } from "@remix-run/react";
import { useEffect, useRef } from "react";
import {
  createUser,
  getUserByEmail,
  setVerifyCode,
} from "~/models/user.server";
import {
  validateEmail,
  validateName,
  validatePassword,
  validateRetypePassword,
  validateUsername,
} from "~/helpers/auth/registerValidate.sever";
import { badRequest } from "~/helpers/badrequest.server";
import Spinner from "~/components/Spinner";

export async function action(args: ActionArgs) {
  const form = await args.request.formData();
  const name = form.get("name") as string;
  const username = form.get("username") as string;
  const email = form.get("email") as string;
  const password = form.get("password") as string;
  const rpassword = form.get("rpassword") as string;

  const errors = {
    name: validateName(name),
    username: validateUsername(username),
    email: validateEmail(email),
    password: validatePassword(password),
    rpassword: validateRetypePassword(password, rpassword),
  };

  if (Object.values(errors).some(Boolean)) {
    return badRequest({ errors });
  }

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return badRequest({
      errors: {
        email: "email sudah terdaftar. sila guna email lain",
      },
    });
  }
  const data = { name, username, email, password };
  console.log(data);
  const user = await createUser(data);
  // create verify code here
  setVerifyCode(user.cuid as string, "rgt");
  // send email here

  // redirect id success
  return redirect(`/verify-email?id=${user.cuid}`);
}

export const meta: MetaFunction = () => ({
  title: "Daftar | App",
});

export default function Register() {
  const actionData = useActionData<typeof action>();
  const transition = useTransition();
  const nameRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const rpasswordRef = useRef<HTMLInputElement>(null);

  const isSubmit = transition.state === "submitting";

  useEffect(() => {
    if (actionData?.errors.name) {
      nameRef.current?.focus();
    } else if (actionData?.errors.username) {
      usernameRef.current?.focus();
    } else if (actionData?.errors.email) {
      emailRef.current?.focus();
    } else if (actionData?.errors.password) {
      passwordRef.current?.focus();
    } else if (actionData?.errors.rpassword) {
      rpasswordRef.current?.focus();
    } else {
      nameRef.current?.focus();
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
              Daftar akaun baru
            </h4>
          </div>
          <Form className="mt-8" method="post">
            <input type="hidden" name="remember" defaultValue="true" />
            <div>
              <label htmlFor="name" className="sr-only">
                Name
              </label>
              <div className="flex rounded-md">
                <input
                  ref={nameRef}
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  className={`w-full appearance-none rounded-none rounded-l-md border ${
                    actionData?.errors.name
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300"
                  } px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                  placeholder="Nama penuh"
                />
                <span className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md">
                  <UserIcon className="h-5 w-5 text-gray-500" />
                </span>
              </div>
              <small className="text-red-500 p-1">
                {!isSubmit && actionData?.errors.name}
              </small>
            </div>
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <div className="flex rounded-md">
                <input
                  ref={usernameRef}
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="name"
                  className={`relative block w-full appearance-none rounded-none rounded-l-md border ${
                    actionData?.errors.username
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300"
                  } px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                  placeholder="Username"
                />
                <span className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md">
                  <UserIcon className="h-5 w-5 text-gray-500" />
                </span>
              </div>
            </div>
            <small className="text-red-500 p-1">
              {!isSubmit && actionData?.errors.username}
            </small>
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <div className="flex rounded-md">
                <input
                  ref={emailRef}
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className={`relative block w-full appearance-none rounded-none rounded-l-md border ${
                    actionData?.errors.email
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300"
                  } px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                  placeholder="Email address"
                />
                <span className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md">
                  <EnvelopeIcon className="h-5 w-5 text-gray-500" />
                </span>
              </div>
              <small className="text-red-500 p-1">
                {!isSubmit && actionData?.errors.email}
              </small>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="flex rounded-md">
                <input
                  ref={passwordRef}
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  className={`relative block w-full appearance-none rounded-none rounded-l-md border  ${
                    actionData?.errors.password
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300"
                  } px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                  placeholder="Kata laluan"
                />
                <span className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md">
                  <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                </span>
              </div>
              <small className="text-red-500 p-1">
                {!isSubmit && actionData?.errors.password}
              </small>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Retype Password
              </label>
              <div className="flex rounded-md">
                <input
                  ref={rpasswordRef}
                  id="rpassword"
                  name="rpassword"
                  type="password"
                  autoComplete="retype-password"
                  className={`relative block w-full appearance-none rounded-none rounded-l-md border  ${
                    actionData?.errors.rpassword
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300"
                  } px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                  placeholder="Ulang kata laluan"
                />
                <span className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md">
                  <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                </span>
              </div>
              <small className="text-red-500 p-1">
                {!isSubmit && actionData?.errors.rpassword}
              </small>
            </div>
            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-500"
                disabled={isSubmit}
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <LockClosedIcon
                    className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                    aria-hidden="true"
                  />
                </span>
                {isSubmit ? <Spinner /> : "Daftar"}
              </button>
            </div>
          </Form>
          <div className="text-sm text-center pt-2">
            <Link
              to="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Dah punya akaun ke ? Sila login.
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
