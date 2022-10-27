import type { User } from "@prisma/client";
import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useTransition,
} from "@remix-run/react";
import { useEffect, useRef } from "react";
import Button from "~/components/Button";
import Input from "~/components/Input";
import Spinner from "~/components/Spinner";
import { badRequest } from "~/helpers/badrequest.server";
import {
  validateName,
  validateUsername,
} from "~/helpers/user/updateuservalidate.server";
import { updateUser } from "~/models/user.server";
import { getUser, getUserId, requireUserId } from "~/utils/auth.server";

export async function action({ request }: ActionArgs) {
  const userId = await getUserId(request);
  const form = await request.formData();
  const name = form.get("name") as string;
  const username = form.get("username") as string;

  const errors = {
    name: validateName(name),
    username: validateUsername(username),
  };

  if (Object.values(errors).some(Boolean)) {
    return badRequest({ errors });
  }

  const data = { userId, name, username };

  const update = await updateUser(data);
  if (!update)
    return badRequest({ errors: { form: "Opss ada kesalahan sistem." } });

  return json({ success: true, message: "Pembaharuan user berjaya." });
}

export async function loader({ request }: LoaderArgs) {
  await requireUserId(request, "/app/settings");
  const user = (await getUser(request)) as User;
  return json({ user: user });
}
export default function Index() {
  const { user } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const nameRef = useRef<HTMLInputElement>();
  const usernameRef = useRef<HTMLInputElement>();
  const transition = useTransition();
  const isSubmit = transition.state === "submitting";

  useEffect(() => {
    if (actionData?.errors && actionData?.errors.name) {
      nameRef.current?.focus();
    } else if (actionData?.errors && actionData?.errors.username) {
      usernameRef.current?.focus();
    }
  }, [actionData]);
  return (
    <div className="border p-4 rounded-md bg-white">
      <img
        src={`${
          user?.image
            ? `/images/profile/${user.image}`
            : "https://placekitten.com/300/300"
        } `}
        alt="profile"
        className="rounded-full w-40"
      />
      <Form method="post" className="w-full md:w-1/2 pt-4">
        <div className="py-2">
          <label className="font-bold">Nama</label>
          <Input
            ref={nameRef}
            id="name"
            name="name"
            type="text"
            error={actionData?.errors ? actionData?.errors.name : ""}
            defaultValue={user.name}
          />
          {!isSubmit && actionData?.errors && actionData?.errors.name && (
            <span className="text-red-500">{actionData?.errors.name}</span>
          )}
        </div>
        <div className="py-2">
          <label className="font-bold">Username</label>
          <Input
            ref={usernameRef}
            id="username"
            name="username"
            type="text"
            error={actionData?.errors ? actionData?.errors.username : ""}
            defaultValue={user.username}
          />
          {!isSubmit && actionData?.errors && actionData?.errors.username && (
            <span className="text-red-500">{actionData?.errors.username}</span>
          )}
        </div>
        <div className="py-2">
          <label className="font-bold">Email</label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={user.email}
            disabled={true}
          />
        </div>
        <div className="py-2">
          <Button type="submit">{isSubmit ? <Spinner /> : "Perbaharui"}</Button>
        </div>
        {!isSubmit && actionData?.success === true && (
          <div className="bg-green-500 text-white rounded-md px-2 py-2">
            {actionData.message}
          </div>
        )}
      </Form>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div className="error-container">
      <h1>App Error</h1>
      <pre>{error.message}</pre>
    </div>
  );
}
