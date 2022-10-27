import type { User } from "@prisma/client";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getUser, requireUserId } from "~/utils/auth.server";

export async function loader({ request }: LoaderArgs) {
  await requireUserId(request, "/app/user");
  const user = (await getUser(request)) as User;
  return json({ user: user });
}
const Index = () => {
  const { user } = useLoaderData<typeof loader>();
  return (
    <div>
      <div className="border p-2 rounded-md grid grid-cols-2 bg-white">
        <div className="col-span-1 pl-4">
          <img
            src={`${
              user.image
                ? `/images/profile/${user.image}`
                : "https://placekitten.com/300/300"
            } `}
            alt="profile"
            className="rounded-full w-40"
          />
          <div className="py-2">
            <p className="font-bold">Nama</p>
            <span>{user.name}</span>
          </div>
          <div className="py-2">
            <p className="font-bold">Username</p>
            <span>{user.username}</span>
          </div>
          <div className="py-2">
            <p className="font-bold">Email</p>
            <span>{user.email}</span>
          </div>
          <div className="py-2">
            <p className="font-bold">Dibuat pada:</p>
            <span>{user.createdAt}</span>
          </div>
          <div className="py-2 w-28 text-center">
            <Link to="/app/user/settings">
              <div className="bg-indigo-500 text-white hover:bg-indigo-700 px-2 py-2 rounded-md">
                Setting
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
