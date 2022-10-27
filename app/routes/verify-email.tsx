import { LockClosedIcon } from "@heroicons/react/24/outline";
import type { ActionArgs, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import Spinner from "~/components/Spinner";
import { badRequest } from "~/helpers/badrequest.server";
import {
  delVerifyCode,
  getUserBycuid,
  getVerifyCode,
  updateVerifyEmail,
} from "~/models/user.server";
import { redis } from "~/utils/redis.server";

export async function action({ request }: ActionArgs) {
  const form = await request.formData();
  const code = form.get("code") as string;
  if (typeof code !== "string" || code.length === 0) {
    return badRequest({
      error: {
        form: "Kod pengesahan diperlukan.",
      },
    });
  }

  const url = new URL(request.url);
  const searchId = url.searchParams.get("id") as string;
  const getCode = await getVerifyCode(searchId, "rgt");
  if (code !== getCode) {
    return badRequest({
      error: {
        form: "Kod pengesahan tak sah.",
      },
    });
  }
  if (!getCode) {
    return badRequest({
      error: {
        form: "Kod pengesahan tamat tempoh.",
      },
    });
  }
  const user = await updateVerifyEmail(searchId);
  if (!user) {
    return badRequest({
      error: {
        form: "NETWORK ERROR",
      },
    });
  }
  await delVerifyCode(searchId, "rgt");
  return redirect("/login");
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const searchId = url.searchParams.get("id") as string;
  const user = await getUserBycuid(searchId);
  const ttl = await redis.ttl(`${searchId}|rgt`);
  if (!user) {
    return redirect("/");
  }
  return json({ ttl, searchId });
};

const VerifyEmail = () => {
  const actionData = useActionData<typeof action>();
  const loaderData = useLoaderData();
  const transition = useTransition();
  const [sec, setSec] = useState<number>(
    loaderData.ttl === -2 ? 0 : loaderData.ttl
  );
  const isSubmit = transition.state === "submitting";
  useEffect(() => {
    const timer =
      sec > 0
        ? setInterval(() => {
            setSec(sec - 1);
          }, 1000)
        : 0;
    return () => {
      // setSec(0);
      clearInterval(timer);
    };
  }, [sec]);
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
              Pengesahan email
            </h4>
          </div>
          <div
            className={`text-center ${
              sec === 0 ? "text-red-500" : "text-green-500"
            }`}
          >
            Kod pengesahan tamat tempoh dalam{" "}
            <span className="font-bold">{sec}</span> saat
          </div>
          {!isSubmit && sec !== 0 && actionData?.error?.form && (
            <div className="bg-red-500 py-2 px-4 rounded-md text-white">
              {actionData?.error?.form}
            </div>
          )}
          {sec === 0 && (
            <div className="py-2 px-4 rounded-md flex flex-col items-center">
              <span className="text-red-500">
                Kod pengesahan tamat tempoh. sila mohon lagi
              </span>
              <a
                href={`/request-code?id=${loaderData?.searchId}`}
                className="bg-indigo-700 px-1 rounded-md text-white"
              >
                Klik disini
              </a>
            </div>
          )}
          <Form className="mt-4" method="post">
            <div className="py-4">
              <label htmlFor="email-address" className="sr-only">
                verification code
              </label>
              <input
                id="email-address"
                name="code"
                type="text"
                autoComplete="verification code"
                className={`relative block w-full appearance-none rounded-md border ${
                  actionData?.errors ? "border-red-500" : "border-gray-300"
                } px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                placeholder="Masukan kod pengesahan."
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
                {isSubmit ? <Spinner /> : "Sahkan akaun anda"}
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
