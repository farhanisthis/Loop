import {
  Home,
  MessageCircle,
  PlusSquare,
  Infinity,
  UserRound,
  Bookmark,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navigationItems = [
  { label: "Home", icon: Home, path: "/" },
  { label: "Messages", icon: MessageCircle, path: "/messages" },
  { label: "Create", icon: PlusSquare, path: "/create" },
  { label: "My Loops", icon: Infinity, path: "/loops" },
  { label: "Saved", icon: Bookmark, path: "/saved" },
  { label: "Profile", icon: UserRound, path: "/profile" },
];

const mobileNavigationItems = ["/", "/create", "/saved", "/profile"]
  .map((path) => navigationItems.find((item) => item.path === path))
  .filter(Boolean);

const MobileNav = () => {
  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-theme-strong bg-surface pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <div className="flex h-16 items-center justify-around">
        {mobileNavigationItems.map(({ label, icon: Icon, path }) => (
          <NavLink
            key={label}
            to={path}
            end={path === "/"}
            aria-label={label}
            className={({ isActive }) =>
              `flex h-full min-w-0 flex-1 flex-col items-center justify-center gap-1 transition-colors ${
                isActive
                  ? "text-violet-600"
                  : "text-gray-500 hover:text-violet-600"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={23} strokeWidth={isActive ? 2.5 : 1.8} />
                <span className="text-[10px] font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default MobileNav;
