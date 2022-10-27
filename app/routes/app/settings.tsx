import { Link, Outlet, useLocation } from "@remix-run/react";

export default function Settings() {
  const { pathname } = useLocation();
  return (
    <div>
      <h2 className="text-2xl text-cyan-900 pb-2">Settings</h2>
      <nav className="flex gap-4">
        <Link to={"/app/settings"}>
          <div
            className={`${
              pathname === "/app/settings" && "text-cyan-900"
            } font-bold`}
          >
            User
          </div>
        </Link>
        <Link to={"/app/settings/update-password"}>
          <div
            className={`${
              pathname === "/app/settings/update-password" && "text-cyan-900"
            } font-bold`}
          >
            Password
          </div>
        </Link>
        <Link to={"/settings/app"}>
          <div className="font-bold">App</div>
        </Link>
      </nav>
      <hr className="my-2" />
      <div className="pt-4">
        <Outlet />
      </div>
    </div>
  );
}
