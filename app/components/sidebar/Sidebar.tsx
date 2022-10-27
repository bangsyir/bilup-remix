import { Link } from "@remix-run/react";
import SidebarContent from "../app/SidebarContent";

const Sidebar = () => {
  return (
    <div className="border-r h-screen sticky top-0">
      <div className="pt-4 px-12">
        <Link to={"/"}>
          <div className="flex gap-2 items-center rounded-md">
            {/* <img src="/logo.svg" className="w-8" alt="logo" /> */}
            <div className="relative">
              <span className="font-bold text-2xl ">Bilup</span>
              <small className="bg-cyan-900 text-white absolute rounded-lg px-1 -top-1 -right-">
                Dev
              </small>
            </div>
          </div>
        </Link>
      </div>
      <div className="pt-12 px-8">
        {/* sidebar content here */}
        <SidebarContent />
      </div>
    </div>
  );
};

export default Sidebar;
