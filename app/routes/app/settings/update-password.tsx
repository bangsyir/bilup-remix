import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData, useTransition } from "@remix-run/react";
import { useEffect, useRef } from "react";
import Button from "~/components/Button";
import Input from "~/components/Input";
import Spinner from "~/components/Spinner";
import {
  validatePassword,
  validateRetypePassword,
} from "~/helpers/auth/registerValidate.sever";
import { badRequest } from "~/helpers/badrequest.server";
import { getuserWithPassword, updatePassword } from "~/models/user.server";
import { getUserId } from "~/utils/auth.server";
import { ComparePassword } from "~/utils/password.server";

type UserState = {
  password: {
    hash: string;
  };
};

export async function ValidateOldPassword(userId: number, oldPassword: string) {
  if (typeof oldPassword !== "string") {
    return "Kata laluan lama diperlukan.";
  }
  const user = (await getuserWithPassword(userId)) as UserState;
  const verifyPassword = await ComparePassword(
    oldPassword,
    user?.password?.hash
  );
  if (!verifyPassword) return "Kata laluan tidak sesuai.";
}

export async function action({ request }: ActionArgs) {
  const userId = await getUserId(request);
  const form = await request.formData();
  const oldPassword = form.get("oldPassword") as string;
  const newPassword = form.get("newPassword") as string;
  const rPassword = form.get("rPassword") as string;

  const errors = {
    oldPassword: await ValidateOldPassword(userId, oldPassword),
    newPassword: validatePassword(newPassword),
    rPassword: validateRetypePassword(newPassword, rPassword),
  };
  if (Object.values(errors).some(Boolean)) {
    return badRequest({ errors });
  }
  console.log(errors);
  const update = await updatePassword(userId, newPassword);
  if (!update)
    return badRequest({
      errors: { form: "Opss Terjadi kesalahan, sila cuba lagi." },
    });
  return json({ success: true, message: "Ubahsuai kata laluan berjaya." });
}

export default function UpdatePasswod() {
  const actionData = useActionData<typeof action>();
  const oldPasswordRef = useRef<HTMLInputElement>();
  const newPasswordRef = useRef<HTMLInputElement>();
  const rPasswordRef = useRef<HTMLInputElement>();
  const transition = useTransition();
  const isSubmit = transition.state === "submitting";

  useEffect(() => {
    if (actionData?.errors && actionData?.errors.oldPassword) {
      return oldPasswordRef.current?.focus();
    } else if (actionData?.errors && actionData?.errors.newPassword) {
      return newPasswordRef.current?.focus();
    } else if (actionData?.errors && actionData?.errors.rPassword) {
      return rPasswordRef.current?.focus();
    } else {
      return oldPasswordRef.current?.focus();
    }
  }, [actionData]);
  return (
    <div className="bg-white border rounded-md p-4">
      <span className="font-bold">Ubah kata laluan</span>
      <Form method="post" className="w-full md:w-1/2 pt-4">
        {actionData?.success && (
          <div className="bg-green-500 rounded-md p-2 text-white">
            {actionData?.message}
          </div>
        )}
        <div>
          <label htmlFor="oldPassword" className="font-bold">
            Kata laluan lama
          </label>
          <Input
            ref={oldPasswordRef}
            id="oldPassword"
            name="oldPassword"
            type="password"
            error={actionData?.errors && actionData?.errors.oldPassword}
            placeholder="Masukkan Kata laluan lama"
          />
          <small className="text-red-500 p-1">
            {actionData?.errors && actionData?.errors.oldPassword}
          </small>
        </div>
        <div>
          <label htmlFor="newPassword" className="font-bold">
            Kata laluan baru
          </label>
          <Input
            ref={newPasswordRef}
            id="newPassword"
            name="newPassword"
            type="password"
            error={actionData?.errors && actionData?.errors.newPassword}
            placeholder="Masukkan Kata laluan baru"
          />
          <small className="text-red-500 p-1">
            {actionData?.errors && actionData?.errors.newPassword}
          </small>
        </div>
        <div>
          <label htmlFor="rPassword" className="font-bold">
            Ulang kata laluan baru
          </label>
          <Input
            ref={rPasswordRef}
            id="rPassword"
            name="rPassword"
            type="password"
            error={actionData?.errors && actionData?.errors.rPassword}
            placeholder="Masukkan Kata laluan baru"
          />
          <small className="text-red-500 p-1">
            {actionData?.errors && actionData?.errors.rPassword}
          </small>
        </div>
        <div>
          <Button type="submit">{isSubmit ? <Spinner /> : "Ubahsuai"}</Button>
        </div>
      </Form>
    </div>
  );
}
