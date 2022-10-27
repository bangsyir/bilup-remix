import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { Form, Link } from "@remix-run/react";
import { Fragment } from "react";

export default function AppNavbar({ username }: { username: string }) {
  return (
    <nav className="border-b sticky top-0 bg-white mb-4 z-50">
      <div className="container mx-auto px-12 md:px-4 py-3">
        <div className="flex justify-end">
          {username && (
            <div className="relative flex items-center">
              <Menu as="div" className="realtive inline-block text-left">
                <div>
                  <Menu.Button className="inline-flex justify-center items-center">
                    <div className="bg-green-600 rounded-full p-2 mr-1"></div>
                    {username} <ChevronDownIcon className="h-4 w-4" />
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-1 py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            className={`${
                              active
                                ? "bg-violet-500 text-white"
                                : "text-gray-900"
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                            to="/app"
                          >
                            Go to apps
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            className={`${
                              active
                                ? "bg-violet-500 text-white"
                                : "text-gray-900"
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                            to="/app/user"
                          >
                            Profile
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        <Form action="/logout" method="post">
                          <button
                            name="_logout"
                            className="group flex w-full items-center rounded-md px-2 text-red-500 py-2 text-sm hover:bg-violet-500 hover:text-white"
                          >
                            Logout
                          </button>
                        </Form>
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
