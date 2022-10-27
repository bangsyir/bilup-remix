import { LockClosedIcon } from "@heroicons/react/24/outline";
import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useActionData, useTransition } from "@remix-run/react";
import Spinner from "~/components/Spinner";
import { badRequest } from "~/helpers/badrequest.server";
import { getUserByEmail, setVerifyCode } from "~/models/user.server";

export async function action({ request }: ActionArgs) {
  const form = await request.formData();
  const email = form.get("email") as string;

  if (typeof email !== "string" || email.length === 0) {
    return badRequest({
      error: {
        form: "Input e-mel dibutuhkan",
      },
    });
  }

  const user = await getUserByEmail(email);
  // console.log(user);
  if (!user)
    return badRequest({
      error: {
        form: "Opps User tidak dijumpai...",
      },
    });

  const setVerify = setVerifyCode(user.cuid, "fp");

  // send link to email
  console.log(
    `http://192.168.0.167:3000/change-password/${user.cuid}/${setVerify}`
  );

  return json({
    success: true,
    message: "Pautan tukar kata laluan sudah dihantar ke e-mel anda.",
  });
}

const ForgotPassword = () => {
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
              Lupa kata laluan
            </h4>
          </div>
          {!isSubmit && actionData?.success === true && (
            <div className="bg-green-500 py-2 px-4 rounded-md text-white">
              {actionData?.message}
            </div>
          )}
          {!isSubmit && actionData?.error?.form && (
            <div className="bg-red-400 py-2 px-4 rounded-md text-white">
              {actionData?.error?.form}
            </div>
          )}
          <Form className="mt-4" method="post">
            <div className="py-4">
              <label htmlFor="email-address" className="sr-only">
                forgot password
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="verification code"
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Masukan E-mel."
              />
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
                {isSubmit ? <Spinner /> : "Mohon"}
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
