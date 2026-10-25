import {
  Home,
  PlusSquare,
  Infinity as LoopIcon,
  UserRound,
  Bookmark,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { usePosts } from "../../context/PostContext";

const navigationitems = [
  { label: "Home", icon: Home, path: "/" },
  // { label: "Messages", icon: MessageCircle, path: "/messages" },
  { label: "Create", icon: PlusSquare, path: "/create" },
  // { label: "My Loops", icon: Infinity, path: "/loops" },
  { label: "Profile", icon: UserRound, path: "/profile" },
  { label: "Saved", icon: Bookmark, path: "/saved" },
];

const Sidebar = () => {
  const { currentUserAvatar, userProfile } = usePosts();

  const displayName = userProfile?.name || userProfile?.username || "Farhan";
  const displayUsername = userProfile?.username?.toLowerCase().replace(/\s+/g, "") || "farhan";

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-60 flex-col border-r border-theme bg-surface px-3 py-6 shadow-theme-sidebar md:flex">
      <div className="mb-8 flex items-center gap-2 px-3">
        <LoopIcon size={26} className="text-violet-600" />
        <span className="text-xl font-bold tracking-tight text-gray-900">
          Loop
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5">
        {navigationitems.map(({ label, icon: Icon, path }) => (
          <NavLink
            key={label}
            to={path}
            end={path === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-left transition-colors cursor-pointer ${
                isActive
                  ? "bg-violet-600 font-semibold text-white"
                  : "font-medium text-gray-600 hover:bg-violet-50 hover:text-violet-700"
              }`
            }
          >
            <Icon size={19} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-4 flex items-center gap-3 rounded-xl border border-theme bg-subtle p-3">
        <img
          src={currentUserAvatar || userProfile?.avatar}
          alt="Your profile"
          className="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-violet-100"
        />

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-gray-900">
            {displayName}
          </p>
          <p className="truncate text-xs text-gray-400">
            @{displayUsername}
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
