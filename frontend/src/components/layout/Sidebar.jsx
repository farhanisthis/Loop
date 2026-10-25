import {
  Home,
  Search,
  Compass,
  MessageCircle,
  Bell,
  PlusSquare,
  Infinity,
  UserRound,
  Bookmark,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const navigationitems = [
  { label: "Home", icon: Home, path: "/" },
  // { label: "Messages", icon: MessageCircle, path: "/messages" },
  { label: "Create", icon: PlusSquare, path: "/create" },
  { label: "My Loops", icon: Infinity, path: "/loops" },
  { label: "Profile", icon: UserRound, path: "/profile" },
  { label: "Saved", icon: Bookmark, path: "/saved" },
];

const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-gray-200 bg-white px-4 py-6 md:flex md: flex-col">
      <div className="mb-10 flex items-center gap-2 px-3">
        <Infinity size={32} className="text-violet-600" />
        <span className="text-2xl font-bold tracking-tight">Loop</span>
      </div>
      <div>
        <nav className="flex flex-col gap-2">
          {navigationitems.map(({ label, icon: Icon, path }) => (
            <NavLink
              key={label}
              to={path}
              end={path === "/"}
              type="button"
              className={({ isActive }) =>
                `flex items-center gap-4 rounded-xl px-4 py-2 text-left transition-colors  cursor-pointer
                  ${
                    isActive
                      ? "bg-violet-600 font-semibold text-white"
                      : "text-gray-700 hover:bg-violet-50 hover:text-violet-700"
                  }`
              }
            >
              <Icon size={21} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto flex items-center gap-3 rounded-xl bg-gray-50 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 font-semibold text-violet-700">
            F
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">Farhan</p>
            <p className="truncate text-xs font-semibold">@farhanisthis</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
