import type { ActionArgs } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import AppNavbar from "~/components/app/AppNavbar";
import Sidebar from "~/components/sidebar/Sidebar";
import { getUser, requireUserId } from "~/utils/auth.server";

export async function loader({ request }: ActionArgs) {
  await requireUserId(request, "/app");
  const user = await getUser(request);
  return { user };
}

const App = () => {
  const { user } = useLoaderData<typeof loader>();
  return (
    <div>
      <div className="grid grid-cols-12">
        <div className="col-span-2 relative">
          <Sidebar />
        </div>
        <div className="col-span-10">
          <AppNavbar username={user?.username as string} />
          <div className="container mx-auto px-4">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
