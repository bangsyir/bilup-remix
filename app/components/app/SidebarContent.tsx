import {
  BuildingStorefrontIcon,
  Cog8ToothIcon,
  CubeIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useLocation } from "@remix-run/react";
import SidebarLink from "../sidebar/SidebarLink";

const SidebarContent = () => {
  const { pathname } = useLocation();
  return (
    <div className="flex flex-col gap-2">
      <SidebarLink
        title="Dashboard"
        redirectTo="/app"
        pathname={pathname as string}
        icon={<BuildingStorefrontIcon className="h-6 w-6" />}
      />
      <SidebarLink
        title="User"
        redirectTo="/app/user"
        pathname={pathname as string}
        icon={<UserCircleIcon className="h-6 w-6" />}
      />
      <SidebarLink
        title="Produk"
        redirectTo="/app/products"
        pathname={pathname as string}
        icon={<CubeIcon className="h-6 w-6" />}
      />
      <SidebarLink
        title="Disabled"
        redirectTo="/app/products"
        pathname={pathname as string}
        disabled={true}
        icon={<CubeIcon className="h-6 w-6" />}
      />
      <SidebarLink
        title="Settings"
        redirectTo="/app/settings"
        pathname={pathname as string}
        icon={<Cog8ToothIcon className="h-6 w-6" />}
      />
    </div>
  );
};

export default SidebarContent;
