import { Link } from "@remix-run/react";
import React from "react";

const SidebarLink = ({
  title,
  redirectTo,
  pathname,
  icon,
  disabled,
}: {
  title: string;
  redirectTo: string;
  pathname: string;
  icon: JSX.Element;
  disabled?: boolean;
}) => {
  return (
    <Link to={redirectTo} className={`${disabled && "pointer-events-none"}`}>
      <div
        className={`${
          pathname.includes(redirectTo)
            ? "text-gray-900"
            : disabled
            ? "text-gray-400"
            : "text-gray-500"
        } hover:text-gray-700 rounded-md px-2 py-2 flex items-center gap-3`}
      >
        {pathname.includes(redirectTo) ? (
          <div className="text-cyan-900">{icon}</div>
        ) : (
          <div>{icon}</div>
        )}
        <span className="font-bold">{title}</span>
      </div>
    </Link>
  );
};

export default SidebarLink;
