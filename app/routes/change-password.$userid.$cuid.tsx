import { LockClosedIcon } from "@heroicons/react/24/outline";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, Link, useActionData, useTransition } from "@remix-run/react";
import Spinner from "~/components/Spinner";
import {
  validatePassword,
  validateRetypePassword,
} from "~/helpers/auth/registerValidate.sever";
import { badRequest } from "~/helpers/badrequest.server";
import {
  delVerifyCode,
  getVerifyCode,
  updatePassword,
} from "~/models/user.server";

export async function action({ request, params }: ActionArgs) {
  const form = await request.formData();
  const password = form.get("password") as string;
  const rpassword = form.get("rpassword") as string;

  if (typeof params.userid !== "string" || typeof params.cuid !== "string") {
    return redirect("/");
  }
  const errors = {
    password: validatePassword(password),
    rpassword: validateRetypePassword(password, rpassword),
  };

  if (Object.values(errors).some(Boolean)) {
    return badRequest({ errors });
  }
  await updatePassword(params.userid, password);

  await delVerifyCode(params.userid, "fp");
  return redirect("/login");
}

export async function loader({ request, params }: LoaderArgs) {
  if (typeof params.userid !== "string" || typeof params.cuid !== "string") {
    return redirect("/");
  }
  const getCode = await getVerifyCode(params.userid, "fp");
  if (!getCode) return redirect("/login");
  if (params.cuid !== getCode) return redirect("/login");
  return {};
}

const ChangePassword = () => {
  const actionData = useActionData<typeof action>();
  const transition = useTransition();
  const isSubmit = transition.state === "submitting";

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
              Update kata kaluan
            </h4>
          </div>
          {!isSubmit && actionData?.error?.form && (
            <div className="bg-red-400 py-2 px-4 rounded-md text-white">
              {actionData?.error?.form}
            </div>
          )}
          <Form className="mt-4" method="post">
            <div>
              <label htmlFor="new-password" className="sr-only">
                forgot password
              </label>
              <input
                id="new-password"
                name="password"
                type="password"
                autoComplete="verification code"
                className={`relative block w-full appearance-none rounded-md border ${
                  !isSubmit && actionData?.errors.password
                    ? "border-red-500"
                    : "border-gray-300"
                } px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                placeholder="Kata laluan baru"
              />
              <small className="text-red-500 p-1">
                {!isSubmit && actionData?.errors.password}
              </small>
            </div>
            <div>
              <label htmlFor="r-password" className="sr-only">
                forgot password
              </label>
              <input
                id="r-password"
                name="rpassword"
                type="password"
                autoComplete="verification code"
                className={`relative block w-full appearance-none rounded-md border ${
                  !isSubmit && actionData?.errors.rpassword
                    ? "border-red-500"
                    : "border-gray-300"
                } px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                placeholder="Ulang kata laluan."
              />
              <small className="text-red-500 p-1">
                {!isSubmit && actionData?.errors.rpassword}
              </small>
            </div>
            <div>
              <button
                type="submit"
                name="aaction"
                value="_verify"
                className={`group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <LockClosedIcon
                    className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                    aria-hidden="true"
                  />
                </span>
                {isSubmit ? <Spinner /> : "Hantar"}
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
