import { ActionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import Navbar from "~/components/Navbar";
import { getUser } from "~/utils/auth.server";
export async function loader({ request }: ActionArgs) {
  const user = await getUser(request);
  return { user };
}
export default function Index() {
  const { user } = useLoaderData<typeof loader>();
  console.log(user);
  return (
    <>
      <Navbar username={user?.username as string} />
    </>
  );
}
